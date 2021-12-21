import { Publisher, Subjects, JobDeletedEvent } from '@ta-vrilance/common';

export class JobDeletedPublisher extends Publisher<JobDeletedEvent> {
    subject: Subjects.JobDeleted = Subjects.JobDeleted;
}