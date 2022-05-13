import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";
import categoryDoc from "../models/category";
import { MessageNotificationPublisher } from "../events/publishers/notification-publisher";

const router = express.Router();

const minutesToExpires = 10 * 60 * 1000;

router.post('/api/orders',
validateHeader, 
body('job_id').notEmpty().withMessage('Job ID Required'),
body('orderer').notEmpty().withMessage('User Orderer ID Required'),
body('price').notEmpty().withMessage('Price is Required'),
body('price').isNumeric().withMessage('Price must be a number'),
body('datetime').notEmpty().withMessage('Order Date is Required'),
body('order_type').notEmpty().withMessage("Order Type Required"),
validateRequest, 
async (req: Request, res: Response) => {
    const { job_id, orderer, price, datetime, order_type } = req.body;

    const user = await userDoc.findById(orderer);
    const job = await jobDoc.findById(job_id);
    const job_user = await userDoc.findById(job.job_created_by as string);
    const category = await categoryDoc.findById(job.job_category as string);
    const timeout = (new Date().getTime() + minutesToExpires) - new Date().getTime();

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const date = new Date(datetime + "+07:00");

    const order = await orderDoc.create(orderer, job_id, price, date, job_user.auth_address, order_type);

    //DONE: EMIT OrderCreatedEvent
    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        job: {
            id: job.id,
            job_title: job.job_title,
            job_description: job.job_description,
            category: {
                id: category.id,
                category_name: category.category_name
            },
            user: {
                id: job_user.id,
                auth_firstname: job_user.auth_firstname,
                auth_lastname: job_user.auth_lastname
            }
        },
        user: {
            id: user.id,
            auth_firstname: user.auth_firstname,
            auth_lastname: user.auth_lastname
        },
        order_status: OrderStatus.Created,
        order_expires_at: timeout.toString(), // TODO: ubah jdi number
        order_price: price,
        order_type: order_type,
        _v: order._v
    });

    new MessageNotificationPublisher(natsWrapper.client).publish({
        user_id: order.orderer_id as string,
        topic: "Pesanan Dibuat",
        message: order_type == 1 ? "Pesanan dengan id " + order.id + " berhasil dibuat. Mohon menunggu pencari jasa untuk melakukan respon." : "Terdapat pesanan dengan id " + order.id + " masuk. Mohon meresponi permintaan ini dalam waktu 10 menit."
    });

    new MessageNotificationPublisher(natsWrapper.client).publish({
        user_id: job.job_created_by as string,
        topic: "Pesanan Dibuat",
        message: order_type == 1 ? "Terdapat pesanan dengan id " + order.id + " masuk. Mohon meresponi permintaan ini dalam 10 menit." : "Pesanan dengan id " + order.id + " berhasil dibuat. Mohon menunggu pencari kerja untuk melakukan respon."
    });

    if(order) return res.status(201).send(order);
    return res.status(500).send({ message: "Something wrong" });
});

export { router as createOrderRouter }