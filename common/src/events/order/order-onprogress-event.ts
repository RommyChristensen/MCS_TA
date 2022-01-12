import { Subjects } from "../subjects";

export interface OrderOnprogressEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderOnprogress; 
    data: {
        id: string;
        _v: number;
    }; 
}