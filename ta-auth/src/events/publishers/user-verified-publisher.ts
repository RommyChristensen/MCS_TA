import { Publisher, Subjects, UserVerifiedEvent } from '@ta-vrilance/common';

export class UserVerifiedPublisher extends Publisher<UserVerifiedEvent> {
    subject: Subjects.UserVerified = Subjects.UserVerified;
}