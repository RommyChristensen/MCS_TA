import { Publisher, Subjects, UserUpdateProfileEvent } from '@ta-vrilance/common';

export class UserChangeProfilePublisher extends Publisher<UserUpdateProfileEvent> {
    subject: Subjects.UserUpdateProfile = Subjects.UserUpdateProfile;
}