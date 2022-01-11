import { Subjects, Publisher, OrderAutoConfirmedEvent } from '@ta-vrilance/common';

export class OrderAutoConfirmPublisher extends Publisher<OrderAutoConfirmedEvent> {
    subject: Subjects.OrderAutoConfirmed = Subjects.OrderAutoConfirmed;
}