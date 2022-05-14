import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jwt from 'jsonwebtoken';
import jobDoc from "../models/job";
import { OrderDonePublisher } from "../events/publishers/order-done-publisher";
import { MessageNotificationPublisher } from "../events/publishers/notification-publisher";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/orders/done',
validateHeader, 
body('order_id').notEmpty().withMessage('Order ID Required'),
validateRequest, 
async (req: Request, res: Response) => {
    const { order_id } = req.body;
    const { id } = jwt.verify(req.header('x-auth-token')!, 'christensen') as JwtPayload;
    const user = await userDoc.findById(id);
    const order = await orderDoc.findById(order_id);
    const job = await jobDoc.findById(order.job_id as string);

    if(order.order_status !== OrderStatus.Progress){
        throw new BadRequestError('Order cannot be set to Done!');
    }

    if(order.orderer_id !== user.id){
        throw new NotAuthorizedError();
    }

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const updatedOrder = await orderDoc.changeStatus(order_id, OrderStatus.Done);

    // Emit Done Order Event
    new OrderDonePublisher(natsWrapper.client).publish({
        id: updatedOrder.id,
        _v: updatedOrder._v
    });

    new MessageNotificationPublisher(natsWrapper.client).publish({
        user_id: job.job_created_by as string,
        topic: "Pekerja Telah Selesai",
        message: "Pekerja pada pesanan dengan id " + order_id + " dan judul " + job.job_title + " telah selesai melakukan pekerjaan. Harap melakukan konfirmasi terhadap pesanan tersebut. \n\nJika tidak melakukan konfirmasi, maka pesanan akan otomatis dikonfirmasi jika sudah lewat 30 menit dari waktu pesanan selesai."
    });

    return res.status(200).send(updatedOrder);
});

export { router as orderDoneRouter }