import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobStatusUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';
import jobDoc, { JobStatus } from '../../models/job';

export class JobStatusUpdatedListener extends Listener<JobStatusUpdatedEvent> {
    subject: Subjects.JobStatusUpdated = Subjects.JobStatusUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobStatusUpdatedEvent['data'], msg: Message){
        const { job_status, id } = data;

        // Update confirmed new user to database
        await jobDoc.updateStatusJob(id, job_status as JobStatus);

        msg.ack();
    }
}