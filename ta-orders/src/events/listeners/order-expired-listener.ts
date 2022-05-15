import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderExpiredEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';
import { MessageNotificationPublisher } from '../publishers/notification-publisher';
import { natsWrapper } from '../../nats-wrapper';
import jobDoc from '../../models/job';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
    subject: Subjects.OrderExpired = Subjects.OrderExpired;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderExpiredEvent['data'], msg: Message){
        const { id, _v } = data;

        const order = await orderDoc.findById(id);
        const job = await jobDoc.findById(order.job_id as string);
        
        if(order.order_status == OrderStatus.Created){
            await orderDoc.changeStatus(id, OrderStatus.Expired);

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: order.orderer_id as string,
                topic: "Pesanan Kadaluarsa",
                message: "Pesanan dengan id " + order.id + " telah kadaluarsa"
            });

            new MessageNotificationPublisher(natsWrapper.client).publish({
                user_id: job.job_created_by as string,
                topic: "Pesanan Kadaluarsa",
                message: "Pesanan dengan id " + order.id + " telah kadaluarsa"
            });
        }
        msg.ack();
    }
}