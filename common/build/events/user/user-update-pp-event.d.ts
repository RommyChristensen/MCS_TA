import { Subjects } from "../subjects";
export interface UserUpdatePPEvent {
    subject: Subjects.UserUpdatePP;
    data: {
        id: string;
        profile: string;
    };
}
