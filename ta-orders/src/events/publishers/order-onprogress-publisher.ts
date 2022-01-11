import { Publisher, Subjects, OrderOnprogressEvent } from '@ta-vrilance/common';

export class OrderOnprogressPublisher extends Publisher<OrderOnprogressEvent> {
    subject: Subjects.OrderOnprogress = Subjects.OrderOnprogress;
}