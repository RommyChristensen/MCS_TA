import { Subjects } from "../subjects";
export interface UserUpdateProfileEvent {
    subject: Subjects.UserUpdateProfile;
    data: {
        id: string;
        firstname: string | null;
        lastname: string | null;
        bio: string | null;
        address: string | null;
        phone: string | null;
    };
}
