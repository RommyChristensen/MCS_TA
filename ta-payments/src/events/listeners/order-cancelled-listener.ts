import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, UserRole } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';
import { PaymentFailedPublisher } from '../publishers/payment-failed-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { OrderPaymentStatus } from '../../models/order-payment-status';
import { OrderPaidPendingPublisher } from '../publishers/order-paid-pending-publisher';
import { MessageNotificationPublisher } from '../publishers/notification-publisher';
import { PaymentSuccessPublisher } from '../publishers/payment-success-publisher';
import { OrderPaidPublisher } from '../publishers/order-paid-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const { id, diffDays, diffHour, user_id, _v } = data;

        if(user_id.indexOf("|") != -1){
            const users = user_id.split("|");
            const price = _v * 0.3;
            const hirer = await userDoc.findById(users[0]);
            const worker = await userDoc.findById(users[1]);
            if(parseInt(diffDays) == 0) {
                if(hirer.auth_saldo - price < 0) {
                    new PaymentFailedPublisher(natsWrapper.client).publish({
                        order_id: id,
                        message: "Saldo Pencari Jasa Tidak Mencukupi",
                        total_payment: price,
                        _v: _v
                    });
        
                    await userDoc.addOrderHistory(hirer.id, id, OrderPaymentStatus.pending, price);
                    await userDoc.addOrderHistory(worker.id, id, OrderPaymentStatus.pending, price);
        
                    new OrderPaidPendingPublisher(natsWrapper.client).publish({
                        id: id,
                        _v: _v
                    })
        
                    new MessageNotificationPublisher(natsWrapper.client).publish({
                        user_id: worker.id,
                        topic: "Pembayaran Tertunda",
                        message: "Pencari Jasa pada pesanan dengan id " + id + " sejumlah IDR " + price + " gagal dalam melakukan pembayaran. Silahkan menunggu pencari jasa melakukan pembayaran lagi."
                    });
        
                    new MessageNotificationPublisher(natsWrapper.client).publish({
                        user_id: hirer.id,
                        topic: "Pembayaran Tertunda",
                        message: "Anda memiliki pembayaran tertunda pada pesanan dengan id " + id + " berjumlah IDR " + price
                    });
                    // publish payment failed cause not enough saldo
                }else{
                    await userDoc.updateSaldo(hirer.id, price * -1);
                    await userDoc.updateSaldo(worker.id, price);
                    // publish payment success
                    new PaymentSuccessPublisher(natsWrapper.client).publish({
                        order_id: id, message: "Pembayaran Sukses", total_payment: price, _v: 1,
                    })
        
                    await userDoc.addOrderHistory(hirer.id, id, OrderPaymentStatus.done, price);
                    await userDoc.addOrderHistory(worker.id, id, OrderPaymentStatus.done, price);
        
                    new OrderPaidPublisher(natsWrapper.client).publish({
                        id: id,
                        _v: _v,
                    })
        
                    new MessageNotificationPublisher(natsWrapper.client).publish({
                        user_id: worker.id,
                        topic: "Pembayaran Berhasil",
                        message: "Pencari Jasa pada pesanan dengan id " + id + " berhasil melakukan pembayaran sejumlah IDR " + price 
                    });
        
                    new MessageNotificationPublisher(natsWrapper.client).publish({
                        user_id: hirer.id,
                        topic: "Pembayaran Berhasil",
                        message: "Pembayaran berhasil pada pesanan dengan id " + id + " dengan jumlah IDR " + price 
                    });
                }
            }
        }

        msg.ack();
    }
}