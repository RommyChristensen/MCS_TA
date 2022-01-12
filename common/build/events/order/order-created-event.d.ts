import { Subjects } from "../subjects";
import { OrderStatus } from "../types/order-status";
export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        job: {
            id: string;
            job_title: string;
            job_description: string;
            category: {
                id: string;
                category_name: string;
            };
            user: {
                id: string;
                auth_firstname: string;
                auth_lastname: string;
            };
        };
        user: {
            id: string;
            auth_firstname: string;
            auth_lastname: string;
        };
        order_status: OrderStatus;
        order_expires_at: string;
        order_price: number;
        _v: number;
    };
}
