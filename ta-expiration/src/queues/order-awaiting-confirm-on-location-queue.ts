import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { OrderAutoCancelledPublisher } from "../events/publishers/order-auto-cancelled-publisher";

interface Payload {
    id: string;
    order_date: Date;
    cancel_code: number;
    _v: number;
}

const orderAutoCancelledQueue = new Queue<Payload>('order:autocancelled', {
    redis: {
        host: process.env.REDIS_HOST
    }
})


// function yang dijalankan ketika job diproses
orderAutoCancelledQueue.process(async (job) => {
    console.log('I want to publish an order:autocancelled event for orderId', job.data.id);
    new OrderAutoCancelledPublisher(natsWrapper.client).publish({
        id: job.data.id,
        cancel_code: job.data.cancel_code,
        order_date: job.data.order_date,
        _v: job.data._v
    });
});

export { orderAutoCancelledQueue };

// DIBUKU PASTI ADA PENJELASAN KOMUNIKASI ANTAR SERVICE
// LIST ENDPOINT