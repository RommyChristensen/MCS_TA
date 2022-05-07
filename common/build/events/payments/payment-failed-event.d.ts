import { Subjects } from "../subjects";
export interface PaymentFailedSuccess {
    subject: Subjects.PaymentFailed;
    data: {
        order_id: string;
        message: string;
        total_payment: number;
        _v: number;
    };
}
