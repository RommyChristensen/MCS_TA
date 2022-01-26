import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCompleted } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserCompletedListener extends Listener<UserCompleted> {
    subject: Subjects.UserCompleted = Subjects.UserCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data: UserCompleted['data'], msg: Message){
        const { id, auth_address, auth_bio, auth_phone, auth_profile, auth_gender, auth_birthdate } = data;

        // Update confirmed new user to database
        await userDoc.updateUser(id, {
            address: auth_address,
            bio: auth_bio,
            phone: auth_phone,
            profile: auth_profile,
            gender: auth_gender,
            birthdate: auth_birthdate
        });

        msg.ack();
    }
}