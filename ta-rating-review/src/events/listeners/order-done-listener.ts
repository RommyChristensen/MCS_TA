import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderDoneEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';

export class OrderDoneListener extends Listener<OrderDoneEvent> {
    subject: Subjects.OrderDone = Subjects.OrderDone;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderDoneEvent['data'], msg: Message){
        const { id, _v } = data;

        // await orderDoc.changeDone(id, OrderStatus.Done);
        
        msg.ack();
    }
}