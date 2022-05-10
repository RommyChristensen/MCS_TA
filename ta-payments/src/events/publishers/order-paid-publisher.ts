import { Publisher, Subjects, OrderPaidEvent } from '@ta-vrilance/common';

export class OrderPaidPublisher extends Publisher<OrderPaidEvent> {
    subject: Subjects.OrderPaid = Subjects.OrderPaid;
}