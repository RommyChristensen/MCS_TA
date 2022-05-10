import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc, { JobStatus } from '../../models/job';

export class JobUpdatedListener extends Listener<JobUpdatedEvent> {
    subject: Subjects.JobUpdated = Subjects.JobUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobUpdatedEvent['data'], msg: Message){
        const { id, job_date, job_description, job_title, job_price } = data;

        // Store updated job to database
        await jobDoc.updateJob(id, job_title, job_description, job_price, job_date);

        msg.ack();
    }
}