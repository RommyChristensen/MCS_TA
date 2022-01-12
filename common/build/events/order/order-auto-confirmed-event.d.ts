import { Subjects } from "../subjects";
export interface OrderAutoConfirmedEvent {
    subject: Subjects.OrderAutoConfirmed;
    data: {
        id: string;
        _v: number;
    };
}
