import { Subjects } from "../subjects";
export interface UserCompleted {
    subject: Subjects.UserCompleted;
    data: {
        id: string;
        auth_address: string;
        auth_phone: string;
        auth_profile: string;
        auth_bio: string;
        auth_gender: string;
        auth_birthdate: Date;
        _v: number;
    };
}
