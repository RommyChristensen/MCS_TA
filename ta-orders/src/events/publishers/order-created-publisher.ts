import { Publisher, Subjects, OrderCreatedEvent } from '@ta-vrilance/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}