import { Subjects } from "../subjects";
export interface OrderAcceptedEvent {
    subject: Subjects.OrderAccepted;
    data: {
        id: string;
        order_date: Date;
        _v: number;
    };
}
