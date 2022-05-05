import { Listener, OrderAcceptedEvent, Subjects } from "@ta-vrilance/common";
import { queueGroupName } from './queue-group-name';
import { Message } from "node-nats-streaming";
import { orderAutoCancelledQueue } from "../../queues/order-awaiting-progress-queue";


export class OrderAcceptedListener extends Listener<OrderAcceptedEvent> {
    subject: Subjects.OrderAccepted = Subjects.OrderAccepted;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderAcceptedEvent['data'], msg: Message) {
        const delay = new Date(data.order_date).getTime() + (30 * 60 * 1000) - new Date().getTime();
        console.log("date now ", new Date().getTime());
        console.log("order date ", new Date(data.order_date).getTime());
        console.log('Waiting this may milliseconds to process the job: ', delay);

        await orderAutoCancelledQueue.add({
            id: data.id,
            order_date: data.order_date,
            cancel_code: 1,
            _v: data._v
        },{
            delay: delay
        });

        msg.ack();
    }
}