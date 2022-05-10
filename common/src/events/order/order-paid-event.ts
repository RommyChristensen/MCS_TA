import { Subjects } from "../subjects";

export interface OrderPaidEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderPaid; 
    data: {
        id: string;
        _v: number;
    }; 
}