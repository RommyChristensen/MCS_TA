import { Subjects } from "../subjects";
export interface OrderConfirmedEvent {
    subject: Subjects.OrderConfirmed;
    data: {
        id: string;
        _v: number;
    };
}
