import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserUpdatedEvent['data'], msg: Message){
        const { id, auth_firstname, auth_lastname, auth_address, auth_phone } = data;

        // Update verified new user to database
        await userDoc.changeProfile(id, {
            firstname: auth_firstname,
            lastname: auth_lastname,
            address: auth_address,
            phone: auth_phone
        });

        msg.ack();
    }
}