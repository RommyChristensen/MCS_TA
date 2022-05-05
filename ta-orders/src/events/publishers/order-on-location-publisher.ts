import { Publisher, Subjects, OrderOnLocationEvent } from '@ta-vrilance/common';

export class OrderOnLocationPublisher extends Publisher<OrderOnLocationEvent> {
    subject: Subjects.OrderOnlocation = Subjects.OrderOnlocation;
}