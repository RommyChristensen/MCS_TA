import { Subjects } from "../subjects";
export interface OrderAcceptedEvent {
    subject: Subjects.OrderAccepted;
    data: {
        id: string;
        _v: number;
    };
}
