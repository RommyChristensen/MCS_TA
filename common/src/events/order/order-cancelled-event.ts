import { Subjects } from "../subjects";

export interface OrderCancelledEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderCancelled; 
    data: {
        id: string;
        user_id: string; // user yang melakukan cancel
        diffDays: string;
        diffHour: string;
        diffMinutes: string;
        diffSeconds: string;
        _v: number;
    }; 
}