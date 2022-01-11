import { Listener, OrderCreatedEvent, Subjects } from "@ta-vrilance/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { orderExpiresQueue } from "../../queues/order-expires-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = parseInt(data.order_expires_at);
        console.log('Waiting this may milliseconds to process the job: ', delay);

        await orderExpiresQueue.add({
            order_id: data.id,
            _v: data._v
        },{
            delay: delay
        });

        msg.ack();
    }
}