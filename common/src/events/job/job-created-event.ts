import { Subjects } from "../subjects";

export interface JobCreatedEvent {
    // set subject to be the name of the event
    subject: Subjects.JobCreated; 
    data: {
        id: string;
        job_title: string;
        job_description: string;
        job_date: Date;
        job_created_by: string; // user id
        job_created_at: Date;
        job_status: string;
        job_price: number;
        job_category: string; // category id
        _v: number;
    }; 
}