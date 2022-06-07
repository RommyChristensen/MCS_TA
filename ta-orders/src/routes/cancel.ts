import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, OrderStatus, UserRole, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jwt from 'jsonwebtoken';
import jobDoc from "../models/job";
import { OrderAcceptedPublisher } from "../events/publishers/order-accepted-publisher";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/orders/cancel',
validateHeader, 
body('order_id').notEmpty().withMessage('Order ID Required'),
validateRequest, 
async (req: Request, res: Response) => {
    const { order_id } = req.body;
    const { id } = jwt.verify(req.header('x-auth-token')!, 'christensen') as JwtPayload;
    const user = await userDoc.findById(id);
    const order = await orderDoc.findById(order_id);

    if(order.order_status !== OrderStatus.Created && order.order_status !== OrderStatus.Accepted){
        throw new BadRequestError('Order cannot be cancelled!');
    }

    // if(order.orderer_id !== user.id){
    //     throw new NotAuthorizedError();
    // }

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const diff = new Date(order.order_date as Date).getTime() - new Date().getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remainderDays = Math.floor(diff % (1000 * 60 * 60 * 24));
    const diffHour = Math.floor(remainderDays / (1000 * 60 * 60));
    const remainderHour = Math.floor(remainderDays % (1000 * 60 * 60));
    const diffMinutes = Math.floor(remainderHour / (1000 * 60));
    const remainderMinutes = Math.floor(remainderHour % (1000 * 60));
    const diffSeconds = Math.floor(remainderMinutes / (1000));
    const remainderSeconds = Math.floor(remainderMinutes % (1000));

    console.log(diffDays, diffHour);

    if((diffDays > 0) || (diffDays == 0 && diffHour >= 3)){
        const updatedOrder = await orderDoc.changeStatus(order_id, OrderStatus.Cancelled);

        // TODO: tambah remainder hari
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: updatedOrder.id,
            _v: updatedOrder._v,
            user_id: user.auth_role == UserRole.Hirer ? user.id + "|" + order.orderer_id : user.id,
            diffDays: diffDays.toString(), 
            diffHour: diffHour.toString(), 
            diffMinutes: diffMinutes.toString(), 
            diffSeconds: diffSeconds.toString()
        })

        return res.send(updatedOrder);
    }else{
        return res.status(500).send({ message: "Cannot cancel order!" })
    }
});

export { router as orderCancelledRouter }

// stonE4768s

// dop_v1_2720f120d7294ffde35528e33b6e3c77d9d93139e871cec3c4b9731c6bc0bcec