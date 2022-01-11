import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CategoryDeletedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import categoryDoc from '../../models/category';

export class CategoryDeletedListener extends Listener<CategoryDeletedEvent> {
    subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
    queueGroupName = queueGroupName;

    async onMessage(data: CategoryDeletedEvent['data'], msg: Message){
        const { id } = data;

        // Store new user to database
        await categoryDoc.deleteById(id);

        msg.ack();
    }
}