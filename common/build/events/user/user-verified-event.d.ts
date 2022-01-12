import { Subjects } from "../subjects";
export interface UserVerifiedEvent {
    subject: Subjects.UserVerified;
    data: {
        id: string;
    };
}
