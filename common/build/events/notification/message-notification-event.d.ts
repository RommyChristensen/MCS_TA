import { Subjects } from "../subjects";
export interface MessageNotificationEvent {
    subject: Subjects.MessageNotification;
    data: {
        user_id: string;
        topic: string;
        message: string;
    };
}
