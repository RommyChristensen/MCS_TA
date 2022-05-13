import { Subjects } from "../subjects";

export interface MessageNotificationEvent {
    // set subject to be the name of the event
    subject: Subjects.MessageNotification; 
    data: {
        user_id: string;
        topic: string;
        message: string;
    }; 
}