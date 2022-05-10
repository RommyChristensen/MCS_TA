import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobStatusUpdatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc, { JobStatus } from '../../models/job';

export class JobStatusUpdatedListener extends Listener<JobStatusUpdatedEvent> {
    subject: Subjects.JobStatusUpdated = Subjects.JobStatusUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobStatusUpdatedEvent['data'], msg: Message){
        const { job_status, id } = data;

        // Update confirmed new user to database
        const job = await jobDoc.findById(id);
        console.log(new Date(job.job_date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime());
        console.log(new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime());

        await jobDoc.updateStatusJob(id, job_status as JobStatus);

        msg.ack();
    }
}