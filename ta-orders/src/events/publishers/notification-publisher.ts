import { Publisher, Subjects, MessageNotificationEvent } from '@ta-vrilance/common';

export class MessageNotificationPublisher extends Publisher<MessageNotificationEvent> {
    subject: Subjects.MessageNotification = Subjects.MessageNotification;
}