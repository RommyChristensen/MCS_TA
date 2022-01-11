import { Publisher, Subjects, UserUpdatePPEvent } from '@ta-vrilance/common';

export class UserUpdatePPPublisher extends Publisher<UserUpdatePPEvent> {
    subject: Subjects.UserUpdatePP = Subjects.UserUpdatePP;
}