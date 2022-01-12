import { Subjects } from "../subjects";

export interface UserVerifiedEvent {
    // set subject to be the name of the event
    subject: Subjects.UserVerified; 
    data: {
        id: string
    }; 
}