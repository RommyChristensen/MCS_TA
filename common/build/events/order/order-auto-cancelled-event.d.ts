import { Subjects } from "../subjects";
export interface OrderAutoCancelledEvent {
    subject: Subjects.OrderAutoCancelled;
    data: {
        id: string;
        order_date: Date;
        cancel_code: number;
        _v: number;
    };
}
