import { Subjects } from "../subjects";

export interface UserConfirmedEvent {
    // set subject to be the name of the event
    subject: Subjects.UserConfirmed; 
    data: {
        id: string
    }; 
}