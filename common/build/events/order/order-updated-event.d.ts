import { Subjects } from "../subjects";
export interface OrderUpdatedEvent {
    subject: Subjects.OrderUpdated;
    data: {
        id: string;
        price: number;
        _v: number;
    };
}
