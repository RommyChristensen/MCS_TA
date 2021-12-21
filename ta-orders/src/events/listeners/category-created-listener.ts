import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CategoryCreatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import categoryDoc from '../../models/category';

export class CategoryCreatedListener extends Listener<CategoryCreatedEvent> {
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: CategoryCreatedEvent['data'], msg: Message){
        const { id, category_description, category_name, _v } = data;

        // Store new user to database
        await categoryDoc.create(id, category_name, category_description);

        msg.ack();
    }
}