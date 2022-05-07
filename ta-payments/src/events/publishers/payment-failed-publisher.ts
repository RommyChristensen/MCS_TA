import { Publisher, Subjects, PaymentFailedEvent } from '@ta-vrilance/common';

export class PaymentFailedPublisher extends Publisher<PaymentFailedEvent> {
    subject: Subjects.PaymentFailed = Subjects.PaymentFailed;
}