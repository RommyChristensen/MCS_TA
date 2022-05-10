import { Publisher, Subjects, OrderPaidPendingEvent } from '@ta-vrilance/common';

export class OrderPaidPendingPublisher extends Publisher<OrderPaidPendingEvent> {
    subject: Subjects.OrderPaidPending = Subjects.OrderPaidPending;
}