import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdateProfileEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserChangeProfileListener extends Listener<UserUpdateProfileEvent> {
    subject: Subjects.UserUpdateProfile = Subjects.UserUpdateProfile;
    queueGroupName = queueGroupName;

    async onMessage(data: UserUpdateProfileEvent['data'], msg: Message){
        const { id, firstname, lastname, bio, address, phone } = data;

        // Update verified new user to database
        await userDoc.changeProfile(id, {
            firstname, lastname, address, phone
        });

        msg.ack();
    }
}