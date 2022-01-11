import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderExpiredEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
    subject: Subjects.OrderExpired = Subjects.OrderExpired;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderExpiredEvent['data'], msg: Message){
        const { id, _v } = data;

        const order = await orderDoc.findById(id);
        
        if(order.order_status == OrderStatus.Created){
            await orderDoc.changeStatus(id, OrderStatus.Expired);
        }
        msg.ack();
    }
}