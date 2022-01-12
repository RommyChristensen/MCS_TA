import { Subjects } from "../subjects";

export interface OrderExpiredEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderExpired; 
    data: {
        id: string;
        _v: number;
    }; 
}