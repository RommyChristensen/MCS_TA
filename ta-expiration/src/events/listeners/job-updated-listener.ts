import { JobUpdatedEvent, Listener, Subjects } from "@ta-vrilance/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { jobDoneQueue } from "../../queues/job-done-queue";


export class JobUpdatedListener extends Listener<JobUpdatedEvent> {
    subject: Subjects.JobUpdated = Subjects.JobUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: JobUpdatedEvent['data'], msg: Message) {
        const { job_date, id, _v } = data;

        const delay = new Date(job_date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime() - new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime();

        console.log("job done " + delay);

        await jobDoneQueue.add({
            job_id: id,
            _v: _v
        },{
            delay: delay
        });

        msg.ack();
    }
}