import { Subjects } from "../subjects";

export interface JobDeletedEvent {
    // set subject to be the name of the event
    subject: Subjects.JobDeleted; 
    data: {
        id: string;
        _v: number;
    }; 
}