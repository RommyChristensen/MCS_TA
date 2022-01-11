import { Publisher, Subjects, OrderAcceptedEvent } from '@ta-vrilance/common';

export class OrderAcceptedPublisher extends Publisher<OrderAcceptedEvent> {
    subject: Subjects.OrderAccepted = Subjects.OrderAccepted;
}