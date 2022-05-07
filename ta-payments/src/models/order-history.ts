import { OrderPaymentStatus } from "./order-payment-status";

export class OrderHistory {
    id: String;
    status: OrderPaymentStatus;
    order_id: String;
}