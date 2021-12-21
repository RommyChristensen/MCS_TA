import { Publisher, Subjects, JobUpdatedEvent } from '@ta-vrilance/common';

export class JobUpdatedPublisher extends Publisher<JobUpdatedEvent> {
    subject: Subjects.JobUpdated = Subjects.JobUpdated;
}