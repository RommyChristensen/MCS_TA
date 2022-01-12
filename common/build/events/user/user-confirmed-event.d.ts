import { Subjects } from "../subjects";
export interface UserConfirmedEvent {
    subject: Subjects.UserConfirmed;
    data: {
        id: string;
    };
}
