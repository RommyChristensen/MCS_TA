import { Publisher, Subjects, OrderConfirmedEvent } from '@ta-vrilance/common';

export class OrderConfirmedPublisher extends Publisher<OrderConfirmedEvent> {
    subject: Subjects.OrderConfirmed = Subjects.OrderConfirmed;
}