import { Subjects } from "../subjects";

export interface PaymentFailedSuccess {
    // set subject to be the name of the event
    subject: Subjects.PaymentFailed; 
    data: {
        order_id: string,
        message: string,
        total_payment: number,
        _v: number
    }; 
}