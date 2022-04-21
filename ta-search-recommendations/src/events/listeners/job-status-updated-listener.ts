import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobCreatedEvent, JobStatusUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc, { JobStatus } from '../../models/job';

export class JobStatusUpdatedListener extends Listener<JobStatusUpdatedEvent> {
    subject: Subjects.JobStatusUpdated = Subjects.JobStatusUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobStatusUpdatedEvent['data'], msg: Message){
        const { id, job_status, _v } = data;

        // Store new user to database
        await jobDoc.updateStatusJob(id, job_status as JobStatus);

        msg.ack();
    }
}