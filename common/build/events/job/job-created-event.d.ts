import { Subjects } from "../subjects";
export interface JobCreatedEvent {
    subject: Subjects.JobCreated;
    data: {
        id: string;
        job_title: string;
        job_description: string;
        job_date: Date;
        job_created_by: string;
        job_created_at: Date;
        job_status: string;
        job_price: number;
        job_category: string;
        _v: number;
    };
}
