import { Subjects, Publisher, OrderAutoCancelledEvent } from '@ta-vrilance/common';

export class OrderAutoCancelledPublisher extends Publisher<OrderAutoCancelledEvent> {
    subject: Subjects.OrderAutoCancelled = Subjects.OrderAutoCancelled;
}