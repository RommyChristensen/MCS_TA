import { Subjects } from "../subjects";

export interface OrderPaidPendingEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderPaidPending; 
    data: {
        id: string;
        _v: number;
    }; 
}