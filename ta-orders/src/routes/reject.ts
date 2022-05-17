import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jwt from 'jsonwebtoken';
import jobDoc from "../models/job";
import { OrderAcceptedPublisher } from "../events/publishers/order-accepted-publisher";
import { MessageNotificationPublisher } from "../events/publishers/notification-publisher";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/orders/reject',
validateHeader, 
body('order_id').notEmpty().withMessage('Order ID Required'),
validateRequest, 
async (req: Request, res: Response) => {
    const { order_id } = req.body;
    const { id } = jwt.verify(req.header('x-auth-token')!, 'christensen') as JwtPayload;
    const user = await userDoc.findById(id);
    const order = await orderDoc.findById(order_id);
    const job = await jobDoc.findById(order.job_id as string);

    if(order.order_status !== OrderStatus.Created){
        throw new BadRequestError('Order cannot be accepted!');
    }

    if(order.order_type == 1){
        if(job.job_created_by !== user.id){
            throw new NotAuthorizedError();
        }
    }else{
        if(order.orderer_id !== user.id){
            throw new NotAuthorizedError();
        }
    }

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const updatedOrder = await orderDoc.changeStatus(order_id, OrderStatus.Rejected);

    if(updatedOrder.order_type == 1){
        new MessageNotificationPublisher(natsWrapper.client).publish({
            user_id: order.orderer_id as string,
            topic: "Pesanan Ditolak",
            message: "Pesanan dengan id " + order_id + " dengan judul " + job.job_title + " telah ditolak oleh pencari jasa."
        });
    }else{
        new MessageNotificationPublisher(natsWrapper.client).publish({
            user_id: job.job_created_by as string,
            topic: "Pesanan Ditolak",
            message: "Pesanan dengan id " + order_id + " dengan judul " + job.job_title + " telah ditolak oleh pencari kerja."
        });
    }

    return res.status(200).send(updatedOrder);
});

export { router as rejectOrderRouter }