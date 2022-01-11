import { Listener, OrderDoneEvent, Subjects } from "@ta-vrilance/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { orderAutoConfirmQueue } from "../../queues/order-auto-confirmed-queue";

const minutesToExpires = 1 * 60 * 1000;

export class OrderDoneListener extends Listener<OrderDoneEvent> {
    subject: Subjects.OrderDone = Subjects.OrderDone;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderDoneEvent['data'], msg: Message) {
        const timeout = (new Date().getTime() + minutesToExpires) - new Date().getTime();

        console.log('Waiting this may milliseconds to process the job: ', timeout);

        await orderAutoConfirmQueue.add({
            order_id: data.id,
            _v: data._v
        },{
            delay: timeout
        });

        msg.ack();
    }
}