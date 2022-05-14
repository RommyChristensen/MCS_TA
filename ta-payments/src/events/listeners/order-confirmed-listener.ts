import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderConfirmedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';
import { PaymentFailedPublisher } from '../publishers/payment-failed-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { PaymentSuccessPublisher } from '../publishers/payment-success-publisher';
import { OrderPaymentStatus } from '../../models/order-payment-status';
import { OrderPaidPendingPublisher } from '../publishers/order-paid-pending-publisher';
import { OrderPaidPublisher } from '../publishers/order-paid-publisher';
import { MessageNotificationPublisher } from '../publishers/notification-publisher';

export class OrderConfirmedListener extends Listener<OrderConfirmedEvent> {
    subject: Subjects.OrderConfirmed = Subjects.OrderConfirmed;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderConfirmedEvent['data'], msg: Message){
        const {id, order_id, orderer_id, worker_id, total_payment, _v} = data;

        const hirer = await userDoc.findById(worker_id);
        const orderer = await userDoc.findById(orderer_id);

        if(hirer.auth_saldo - parseInt(total_payment) < 0) {
            new PaymentFailedPublisher(natsWrapper.client).publish({
                order_id: order_id,
                message: "Saldo Pencari Jasa Tidak Mencukupi",
                total_payment: parseInt(total_payment),
                _v: _v
            });

            await userDoc.addOrderHistory(hirer.id, order_id, OrderPaymentStatus.pending, parseInt(total_payment));
            await userDoc.addOrderHistory(orderer.id, order_id, OrderPaymentStatus.pending, parseInt(total_payment));

            new OrderPaidPendingPublisher(natsWrapper.client).publish({
                id: order_id,
                _v: _v
            })

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: orderer_id,
                topic: "Pembayaran Tertunda",
                message: "Pencari Jasa pada pesanan dengan id " + order_id + " sejumlah IDR " + total_payment + " gagal dalam melakukan pembayaran. Silahkan menunggu pencari jasa melakukan pembayaran lagi."
            });

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: hirer.id,
                topic: "Pembayaran Tertunda",
                message: "Anda memiliki pembayaran tertunda pada pesanan dengan id " + order_id + " berjumlah IDR " + total_payment
            });
            // publish payment failed cause not enough saldo
        }else{
            await userDoc.updateSaldo(hirer.id, parseInt(total_payment) * -1);
            await userDoc.updateSaldo(orderer.id, parseInt(total_payment));
            // publish payment success
            new PaymentSuccessPublisher(natsWrapper.client).publish({
                order_id, message: "Pembayaran Sukses", total_payment: parseInt(total_payment), _v,
            })

            await userDoc.addOrderHistory(hirer.id, order_id, OrderPaymentStatus.done, parseInt(total_payment));
            await userDoc.addOrderHistory(orderer.id, order_id, OrderPaymentStatus.done, parseInt(total_payment));

            new OrderPaidPublisher(natsWrapper.client).publish({
                id: order_id,
                _v: _v,
            })

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: orderer_id,
                topic: "Pembayaran Berhasil",
                message: "Pencari Jasa pada pesanan dengan id " + order_id + " berhasil melakukan pembayaran sejumlah IDR " + total_payment 
            });

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: hirer.id,
                topic: "Pembayaran Berhasil",
                message: "Pembayaran berhasil pada pesanan dengan id " + order_id + " dengan jumlah IDR " + total_payment 
            });
        }

        msg.ack();
    }
}