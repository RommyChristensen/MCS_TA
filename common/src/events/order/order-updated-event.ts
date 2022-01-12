import { Subjects } from "../subjects";
import { OrderStatus } from "../types/order-status";

export interface OrderUpdatedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderUpdated; 
    data: {
        id: string;
        price: number;
        _v: number;
    }; 
}