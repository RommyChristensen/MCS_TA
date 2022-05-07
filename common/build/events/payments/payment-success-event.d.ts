import { Subjects } from "../subjects";
export interface PaymentSuccessEvent {
    subject: Subjects.PaymentSuccess;
    data: {
        order_id: string;
        message: string;
        total_payment: number;
        _v: number;
    };
}
