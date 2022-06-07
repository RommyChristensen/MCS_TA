import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, UserRole } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const { id, diffDays, diffHour, user_id } = data;

        if(user_id.indexOf("|") != -1){
            const users = user_id.split("|");
            const hirer = await userDoc.findById(users[0]);
            const worker = await userDoc.findById(users[1]);
            if(parseInt(diffDays) == 0) {
                console.log(hirer, worker);
            }
        }

        msg.ack();
    }
}