import { Subjects } from "../subjects";
export interface JobStatusUpdatedEvent {
    subject: Subjects.JobStatusUpdated;
    data: {
        id: string;
        job_status: string;
        _v: number;
    };
}
