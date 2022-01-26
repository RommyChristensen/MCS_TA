import { Subjects } from "../subjects";

export interface UserCompleted {
    // set subject to be the name of the event
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