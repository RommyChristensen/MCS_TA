import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCancelledEvent, UserRole } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import ratingReviewDoc from '../../models/rating-review';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const { id, diffDays, diffHour, user_id } = data;

        if(user_id.indexOf("|") != -1){
            const users = user_id.split("|");
            
        }else{
            const order = await orderDoc.findById(id);
            if(user_id == order.user.id){
                if(parseInt(diffDays) == 0) {
                    await ratingReviewDoc.create(id, 2, "Dibatalkan Sepihak", user_id);
                }
            }
        }

        msg.ack();
    }
}