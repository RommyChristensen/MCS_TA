import { Subjects } from "../subjects";

export interface UserUpdatePPEvent {
    // set subject to be the name of the event
    subject: Subjects.UserUpdatePP; 
    data: {
        id: string,
        profile: string
    }; 
}