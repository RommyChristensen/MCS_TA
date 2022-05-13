import { Message } from 'node-nats-streaming';
import { Subjects, Listener, MessageNotificationEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import notificationDoc from '../../models/notifications';
import userDoc from '../../models/user';

export class MessageNotificationListener extends Listener<MessageNotificationEvent> {
    subject: Subjects.MessageNotification = Subjects.MessageNotification;
    queueGroupName = queueGroupName;

    async onMessage(data: MessageNotificationEvent['data'], msg: Message){
        const { topic, message, user_id } = data;

        // Store new user to database
        const user = await userDoc.findById(user_id);
        await notificationDoc.create(user_id, topic, message, user.auth_profile);

        msg.ack();
    }
}