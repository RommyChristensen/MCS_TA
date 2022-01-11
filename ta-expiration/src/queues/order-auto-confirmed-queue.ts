import Queue from "bull";
import { OrderAutoConfirmedEvent } from "@ta-vrilance/common";
// import { JobExpiredPublisher } from "../events/publishers/job-expired-publisher";
import { natsWrapper } from "../nats-wrapper";
import { OrderAutoConfirmPublisher } from "../events/publishers/order-auto-confirm-publisher";

interface Payload {
    order_id: string;
    _v: number;
}

const orderAutoConfirmQueue = new Queue<Payload>('order:autoconfirm', {
    redis: {
        host: process.env.REDIS_HOST
    }
})


// function yang dijalankan ketika job diproses
orderAutoConfirmQueue.process(async (job) => {
    console.log('I want to publish an order:autoconfirm event for orderId', job.data.order_id);

    new OrderAutoConfirmPublisher(natsWrapper.client).publish({
        id: job.data.order_id,
        _v: job.data._v
    });

    // new OrderExpiredPublisher(natsWrapper.client).publish({
    //     id: job.data.order_id,
    //     _v: job.data._v
    // })
    // new JobExpiredPublisher(natsWrapper.client).publish({
    //     id: job.data.order_id,
    //     _v: 1
    // })
});

export { orderAutoConfirmQueue };

// DIBUKU PASTI ADA PENJELASAN KOMUNIKASI ANTAR SERVICE
// LIST ENDPOINT