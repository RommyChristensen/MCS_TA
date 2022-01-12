import { Subjects } from "../subjects";
export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;
        user_id: string;
        diffDays: string;
        diffHour: string;
        diffMinutes: string;
        diffSeconds: string;
        _v: number;
    };
}
