import { Publisher, Subjects, UserCompleted } from '@ta-vrilance/common';

export class UserCompletedPublisher extends Publisher<UserCompleted> {
    subject: Subjects.UserCompleted = Subjects.UserCompleted;
}