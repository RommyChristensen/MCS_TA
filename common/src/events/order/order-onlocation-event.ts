import { Subjects } from "../subjects";

export interface OrderOnLocationEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderOnlocation; 
    data: {
        id: string;
        _v: number;
    }; 
}