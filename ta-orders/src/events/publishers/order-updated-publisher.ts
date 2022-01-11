import { Publisher, Subjects, OrderUpdatedEvent } from '@ta-vrilance/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
    subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}