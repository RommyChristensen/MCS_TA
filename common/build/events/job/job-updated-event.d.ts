import { Subjects } from "../subjects";
export interface JobUpdatedEvent {
    subject: Subjects.JobUpdated;
    data: {
        id: string;
        job_title: string;
        job_description: string;
        job_date: Date;
        job_price: number;
        _v: number;
    };
}
