import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jwt from 'jsonwebtoken';
import jobDoc from "../models/job";
import { OrderConfirmedPublisher } from "../events/publishers/order-confirmed-publisher";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/orders/confirmed',
validateHeader, 
body('order_id').notEmpty().withMessage('Order ID Required'),
validateRequest,
async (req: Request, res: Response) => {
    const { order_id } = req.body;
    const { id } = jwt.verify(req.header('x-auth-token')!, 'christensen') as JwtPayload;
    const user = await userDoc.findById(id);
    const order = await orderDoc.findById(order_id);

    if(order.order_status !== OrderStatus.Done){
        throw new BadRequestError('Order cannot be set to Confirmed!');
    }

    if(order.orderer_id !== user.id){
        throw new NotAuthorizedError();
    }

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const updatedOrder = await orderDoc.changeStatus(order_id, OrderStatus.Confirmed);

    // Emit Confirmed Order Event
    new OrderConfirmedPublisher(natsWrapper.client).publish({
        id: updatedOrder.id,
        _v: updatedOrder._v
    });

    return res.status(200).send(updatedOrder);
});

export { router as orderConfirmedRouter }