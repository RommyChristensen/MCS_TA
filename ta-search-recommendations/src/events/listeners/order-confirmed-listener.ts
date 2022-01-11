import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderConfirmedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import historyDoc from '../../models/order-history';

export class OrderConfirmedListener extends Listener<OrderConfirmedEvent> {
    subject: Subjects.OrderConfirmed = Subjects.OrderConfirmed;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderConfirmedEvent['data'], msg: Message){
        const { id } = data;

        // Store new user to database
        await historyDoc.confirmOrder(id);

        msg.ack();
    }
}