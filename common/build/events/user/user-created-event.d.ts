import { Subjects } from "../subjects";
export interface UserCreatedEvent {
    subject: Subjects.UserCreated;
    data: {
        id: string;
        auth_firstname: string;
        auth_lastname: string;
        auth_username: string;
        auth_password: string;
        auth_email: string;
        auth_verified: Boolean;
        auth_confirmed: Boolean;
        auth_role: string;
        _v: number;
    };
}
