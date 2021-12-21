import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserVerifiedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserVerifiedListener extends Listener<UserVerifiedEvent> {
    subject: Subjects.UserVerified = Subjects.UserVerified;
    queueGroupName = queueGroupName;

    async onMessage(data: UserVerifiedEvent['data'], msg: Message){
        const { id } = data;

        // Update verified new user to database
        await userDoc.verifyUser(id);

        msg.ack();
    }
}