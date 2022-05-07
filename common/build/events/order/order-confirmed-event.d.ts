import { Subjects } from "../subjects";
export interface OrderConfirmedEvent {
    subject: Subjects.OrderConfirmed;
    data: {
        id: string;
        order_id: string;
        worker_id: string;
        orderer_id: string;
        total_payment: string;
        _v: number;
    };
}
