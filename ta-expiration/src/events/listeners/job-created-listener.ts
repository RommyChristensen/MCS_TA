import { JobCreatedEvent, Listener, Subjects } from "@ta-vrilance/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { jobDoneQueue } from "../../queues/job-done-queue";


export class JobCreatedListener extends Listener<JobCreatedEvent> {
    subject: Subjects.JobCreated = Subjects.JobCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobCreatedEvent['data'], msg: Message) {
        const { job_date, id, _v } = data;

        const delay = new Date(job_date).getTime() - new Date().getTime();

        await jobDoneQueue.add({
            job_id: id,
            _v: _v
        },{
            delay: delay
        });

        msg.ack();
    }
}