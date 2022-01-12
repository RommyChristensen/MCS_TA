import { Subjects } from "../subjects";

export interface UserUpdatedEvent {
    // set subject to be the name of the event
    subject: Subjects.UserUpdated; 
    data: {
        id: string;
        auth_firstname: string;
        auth_lastname: string;
        auth_username: string;
        auth_password: string;
        auth_email: string;
        auth_verified: Boolean;
        auth_role: string;
        auth_address: string;
        auth_phone: string;
        auth_profile: string;
        auth_bio: string;
        _v: number;
    }; 
}