import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCreatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserCreatedEvent['data'], msg: Message){
        const { id, auth_username, auth_firstname, auth_lastname, auth_email, auth_password, auth_verified, auth_role, _v } = data;

        // Store new user to database
        await userDoc.create(id, auth_username, auth_password, auth_email, auth_verified, false, auth_firstname, _v, auth_lastname, auth_role);

        msg.ack();
    }
}