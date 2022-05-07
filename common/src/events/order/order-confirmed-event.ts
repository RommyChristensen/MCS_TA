import { Subjects } from "../subjects";

export interface OrderConfirmedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderConfirmed; 
    data: {
        id: string;
        order_id: string;
        worker_id: string,
        orderer_id: string,
        total_payment: string,
        _v: number;
    }; 
}