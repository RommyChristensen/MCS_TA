import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderAutoCancelledEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';
import { OrderConfirmedPublisher } from '../publishers/order-confirmed-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { MessageNotificationPublisher } from '../publishers/notification-publisher';
import jobDoc from '../../models/job';

export class OrderAutoCancelledListener extends Listener<OrderAutoCancelledEvent> {
    subject: Subjects.OrderAutoCancelled = Subjects.OrderAutoCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderAutoCancelledEvent['data'], msg: Message){
        const { id, order_date, cancel_code, _v } = data;

        const order = await orderDoc.findById(id);
        
        if(order.order_status == OrderStatus.Accepted){
            const updatedOrder = await orderDoc.changeStatus(id, OrderStatus.Cancelled);
            const job = await jobDoc.findById(order.job_id as string);

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: order.orderer_id as string,
                topic: "Pesanan Dibatalkan",
                message: "Pesanan dengan id " + order.id + " telah dibatalkan"
            });

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: job.job_created_by as string,
                topic: "Pesanan Dibatalkan",
                message: "Pesanan dengan id " + order.id + " telah dibatalkan"
            });
        }

        msg.ack();
    }
}