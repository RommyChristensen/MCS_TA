import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';
import historyDoc from '../../models/order-history';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const { id, job, user, order_status } = data;

        // Store new user to database
        await historyDoc.create(id, job.id, user.id, job.user.id, order_status, job.category.id, job.category.category_name);

        msg.ack();
    }
}