import { Message } from 'node-nats-streaming';
import { Subjects, Listener, JobDeletedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import jobDoc, { JobStatus } from '../../models/job';

export class JobDeletedListener extends Listener<JobDeletedEvent> {
    subject: Subjects.JobDeleted = Subjects.JobDeleted;
    queueGroupName = queueGroupName;

    async onMessage(data: JobDeletedEvent['data'], msg: Message){
        const { id, _v } = data;

        // Store new user to database
        await jobDoc.deleteById(id);

        msg.ack();
    }
}