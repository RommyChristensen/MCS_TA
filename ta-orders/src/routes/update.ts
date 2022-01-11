import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jwt from 'jsonwebtoken';
import { OrderUpdatedPublisher } from "../events/publishers/order-updated-publisher";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.put('/api/orders',
validateHeader, 
body('order_id').notEmpty().withMessage('Job ID Required'),
body('price').notEmpty().withMessage('Price is Required'),
body('price').isNumeric().withMessage('Price must be a number'),
validateRequest, 
async (req: Request, res: Response) => {
    const { order_id, price } = req.body;
    const { id } = jwt.verify(req.header('x-auth-token')!, 'christensen') as JwtPayload;
    const user = await userDoc.findById(id);
    const order = await orderDoc.findById(order_id);

    if(order.order_status !== OrderStatus.Created){
        throw new BadRequestError('Order cannot be changed!');
    }

    if(order.orderer_id !== user.id){
        throw new NotAuthorizedError();
    }

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const updatedOrder = await orderDoc.update(order_id, price);

    // TODO: emit Updated Order Event
    new OrderUpdatedPublisher(natsWrapper.client).publish({
        id: order_id,
        price: price,
        _v: updatedOrder._v
    });

    return res.status(200).send(updatedOrder);
});

export { router as updateOrderRouter }