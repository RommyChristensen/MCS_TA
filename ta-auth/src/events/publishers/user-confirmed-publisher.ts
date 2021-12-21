import { Publisher, Subjects, UserConfirmedEvent } from '@ta-vrilance/common';

export class UserConfirmedPublisher extends Publisher<UserConfirmedEvent> {
    subject: Subjects.UserConfirmed = Subjects.UserConfirmed;
}