import { Publisher, Subjects, OrderCancelledEvent } from '@ta-vrilance/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}