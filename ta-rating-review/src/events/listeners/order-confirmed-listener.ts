import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderConfirmedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';

export class OrderConfirmedListener extends Listener<OrderConfirmedEvent> {
    subject: Subjects.OrderConfirmed = Subjects.OrderConfirmed;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderConfirmedEvent['data'], msg: Message){
        const { id, _v } = data;

        await orderDoc.changeConfirmed(id, OrderStatus.Confirmed);
        
        msg.ack();
    }
}