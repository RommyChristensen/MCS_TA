import { Subjects } from "../subjects";

export interface OrderDoneEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderDone; 
    data: {
        id: string;
        _v: number;
    }; 
}