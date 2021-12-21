import { Publisher, Subjects, JobCreatedEvent } from '@ta-vrilance/common';

export class JobCreatedPublisher extends Publisher<JobCreatedEvent> {
    subject: Subjects.JobCreated = Subjects.JobCreated;
}