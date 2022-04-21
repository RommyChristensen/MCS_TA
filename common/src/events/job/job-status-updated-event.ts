import { Subjects } from "../subjects";

export interface JobStatusUpdatedEvent {
    // set subject to be the name of the event
    subject: Subjects.JobStatusUpdated; 
    data: {
        id: string;
        job_status: string;
        _v: number;
    }; 
}