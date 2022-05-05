import { Subjects } from "../subjects";

export interface OrderAcceptedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderAccepted; 
    data: {
        id: string;
        order_date: Date;
        _v: number;
    }; 
}