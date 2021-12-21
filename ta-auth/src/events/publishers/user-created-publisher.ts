import { Publisher, Subjects, UserCreatedEvent } from '@ta-vrilance/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
}