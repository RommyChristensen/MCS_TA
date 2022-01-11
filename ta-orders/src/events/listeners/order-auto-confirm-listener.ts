import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderAutoConfirmedEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import orderDoc from '../../models/order';
import { OrderStatus } from '@ta-vrilance/common';
import { OrderConfirmedPublisher } from '../publishers/order-confirmed-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class OrderAutoConfirmedListener extends Listener<OrderAutoConfirmedEvent> {
    subject: Subjects.OrderAutoConfirmed = Subjects.OrderAutoConfirmed;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderAutoConfirmedEvent['data'], msg: Message){
        const { id, _v } = data;

        const order = await orderDoc.findById(id);
        
        if(order.order_status == OrderStatus.Done){
            const updatedOrder = await orderDoc.changeStatus(id, OrderStatus.Confirmed);

            new OrderConfirmedPublisher(natsWrapper.client).publish({
                id: updatedOrder.id,
                _v: updatedOrder._v
            });
        }

        msg.ack();
    }
}