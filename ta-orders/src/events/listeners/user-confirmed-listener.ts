import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserConfirmedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserConfirmedListener extends Listener<UserConfirmedEvent> {
    subject: Subjects.UserConfirmed = Subjects.UserConfirmed;
    queueGroupName = queueGroupName;

    async onMessage(data: UserConfirmedEvent['data'], msg: Message){
        const { id } = data;

        // Update confirmed new user to database
        await userDoc.confirmUser(id);

        msg.ack();
    }
}