import { Subjects, Publisher, JobStatusUpdatedEvent } from '@ta-vrilance/common';

export class JobDonePublisher extends Publisher<JobStatusUpdatedEvent> {
    subject: Subjects.JobStatusUpdated = Subjects.JobStatusUpdated;
}