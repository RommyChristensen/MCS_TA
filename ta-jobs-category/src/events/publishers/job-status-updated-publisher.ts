import { Publisher, Subjects, JobStatusUpdatedEvent } from '@ta-vrilance/common';

export class JobStatusUpdatedPublisher extends Publisher<JobStatusUpdatedEvent> {
    subject: Subjects.JobStatusUpdated = Subjects.JobStatusUpdated;
}