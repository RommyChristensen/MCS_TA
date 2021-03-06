import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobCreatedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc from '../../models/job';

export class JobCreatedListener extends Listener<JobCreatedEvent> {
    subject: Subjects.JobCreated = Subjects.JobCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobCreatedEvent['data'], msg: Message){
        const { id, job_title, job_description, job_date, job_created_by, job_created_at, job_price, job_category, _v } = data;

        // Store new user to database
        if(!await jobDoc.findById(id)){
            await jobDoc.create(id, job_title, job_description, job_date, job_created_by, job_price, job_category, job_created_at);
        }

        msg.ack();
    }
}