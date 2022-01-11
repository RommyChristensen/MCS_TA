import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CategoryUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import categoryDoc from '../../models/category';

export class CategoryUpdatedListener extends Listener<CategoryUpdatedEvent> {
    subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: CategoryUpdatedEvent['data'], msg: Message){
        const { id, category_name, category_description } = data;

        // Store new user to database
        await categoryDoc.updateCategory(id, category_name, category_description);

        msg.ack();
    }
}