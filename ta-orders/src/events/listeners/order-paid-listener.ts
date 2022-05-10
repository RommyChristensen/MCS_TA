import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderPaidEvent, OrderStatus } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';

export class OrderPaidListener extends Listener<OrderPaidEvent> {
    subject: Subjects.OrderPaid = Subjects.OrderPaid;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderPaidEvent['data'], msg: Message){
        const { id, _v } = data;

        // Store new user to database
        await orderDoc.changeStatus(id, OrderStatus.Paid);

        msg.ack();
    }
}