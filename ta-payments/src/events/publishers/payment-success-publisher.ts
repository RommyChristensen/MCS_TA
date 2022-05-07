import { Publisher, Subjects, PaymentSuccessEvent } from '@ta-vrilance/common';

export class PaymentSuccessPublisher extends Publisher<PaymentSuccessEvent> {
    subject: Subjects.PaymentSuccess = Subjects.PaymentSuccess;
}