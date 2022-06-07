import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, UserRole } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import userDoc from '../../models/user';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const { id, diffDays, diffHour, user_id } = data;

        const user = await userDoc.findById(user_id);
        if(user.auth_role == UserRole.Hirer){
            if(parseInt(diffDays) == 0 && parseInt(diffHour) <= 3) {

            }else{

            }
        }

        msg.ack();
    }
}