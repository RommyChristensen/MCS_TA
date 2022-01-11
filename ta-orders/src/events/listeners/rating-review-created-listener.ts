import { Message } from 'node-nats-streaming';
import { Subjects, Listener, RatingReviewCreatedEvent, OrderStatus } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc from '../../models/job';
import orderDoc from '../../models/order';

export class RatingReviewCreatedListener extends Listener<RatingReviewCreatedEvent> {
    subject: Subjects.RatingReviewCreated = Subjects.RatingReviewCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: RatingReviewCreatedEvent['data'], msg: Message){
        const { order_id, _v } = data;

        // Store new user to database
        await orderDoc.changeStatus(order_id, OrderStatus.Reviewed);

        msg.ack();
    }
}