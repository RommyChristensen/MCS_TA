import { Subjects } from "../subjects";
export interface OrderPaidPendingEvent {
    subject: Subjects.OrderPaidPending;
    data: {
        id: string;
        _v: number;
    };
}
