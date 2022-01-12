import { Subjects } from "../subjects";

export interface OrderConfirmedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderConfirmed; 
    data: {
        id: string;
        _v: number;
    }; 
}