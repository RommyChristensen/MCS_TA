import { Publisher, Subjects, OrderDoneEvent } from '@ta-vrilance/common';

export class OrderDonePublisher extends Publisher<OrderDoneEvent> {
    subject: Subjects.OrderDone = Subjects.OrderDone;
}