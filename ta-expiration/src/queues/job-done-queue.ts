import Queue from "bull";
import { JobStatusUpdatedEvent } from "@ta-vrilance/common";
// import { JobExpiredPublisher } from "../events/publishers/job-expired-publisher";
import { natsWrapper } from "../nats-wrapper";
import { OrderAutoConfirmPublisher } from "../events/publishers/order-auto-confirm-publisher";
import { JobDonePublisher } from "../events/publishers/job-done-publisher";

interface Payload {
    job_id: string;
    _v: number;
}

const jobDoneQueue = new Queue<Payload>('job:statusupdated', {
    redis: {
        host: process.env.REDIS_HOST
    }
})


// function yang dijalankan ketika job diproses
jobDoneQueue.process(async (job) => {
    console.log('I want to publish an job:done event for jobId', job.data.job_id);

    // emit job done event
    new JobDonePublisher(natsWrapper.client).publish({
        id: job.data.job_id,
        _v: job.data._v,
        job_status: 'Selesai'
    })
});

export { jobDoneQueue };

// DIBUKU PASTI ADA PENJELASAN KOMUNIKASI ANTAR SERVICE
// LIST ENDPOINT