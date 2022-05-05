import { Subjects } from "../subjects";
export interface OrderOnLocationEvent {
    subject: Subjects.OrderOnlocation;
    data: {
        id: string;
        order_date: Date;
        _v: number;
    };
}
