import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserUpdatePPEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class UserUpdatePPListener extends Listener<UserUpdatePPEvent> {
    subject: Subjects.UserUpdatePP = Subjects.UserUpdatePP;
    queueGroupName = queueGroupName;

    async onMessage(data: UserUpdatePPEvent['data'], msg: Message){
        const { id, profile } = data;

        // Store new user to database
        await userDoc.changepp(id, profile);

        msg.ack();
    }
}