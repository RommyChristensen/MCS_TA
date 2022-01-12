import { Subjects } from "../subjects";

export interface OrderAutoConfirmedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderAutoConfirmed; 
    data: {
        id: string;
        _v: number;
    }; 
}