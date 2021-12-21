import Queue from "bull";
// import { JobExpiredPublisher } from "../events/publishers/job-expired-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    order_id: string;
}

const orderExpiresQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

// function yang dijalankan ketika job diproses
orderExpiresQueue.process(async (job) => {
    console.log('I want to publish an expiration:completed event for orderId', job.data.order_id);
    // new JobExpiredPublisher(natsWrapper.client).publish({
    //     id: job.data.order_id,
    //     _v: 1
    // })
});

export { orderExpiresQueue };

// DIBUKU PASTI ADA PENJELASAN KOMUNIKASI ANTAR SERVICE
// LIST ENDPOINT