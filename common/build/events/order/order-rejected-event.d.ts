import { Subjects } from "../subjects";
export interface OrderRejectedEvent {
    subject: Subjects.OrderRejected;
    data: {
        id: string;
        _v: number;
    };
}
