import { Subjects } from "../subjects";

export interface OrderRejectedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderRejected; 
    data: {
        id: string;
        _v: number;
    }; 
}