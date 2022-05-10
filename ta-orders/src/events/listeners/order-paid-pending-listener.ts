import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderPaidPendingEvent, OrderStatus } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';

export class OrderPaidPendingListener extends Listener<OrderPaidPendingEvent> {
    subject: Subjects.OrderPaidPending = Subjects.OrderPaidPending;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderPaidPendingEvent['data'], msg: Message){
        const { id, _v } = data;

        // Store new user to database
        await orderDoc.changeStatus(id, OrderStatus.PaidPending);

        msg.ack();
    }
}