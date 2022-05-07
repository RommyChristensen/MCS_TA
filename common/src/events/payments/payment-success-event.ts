import { Subjects } from "../subjects";

export interface PaymentSuccessEvent {
    // set subject to be the name of the event
    subject: Subjects.PaymentSuccess; 
    data: {
        order_id: string,
        message: string,
        total_payment: number,
        _v: number
    }; 
}