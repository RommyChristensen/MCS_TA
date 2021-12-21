import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";
import categoryDoc from "../models/category";

const router = express.Router();

const minutesToExpires = 1 * 60 * 1000;

router.post('/api/orders',
validateHeader, 
body('job_id').notEmpty().withMessage('Job ID Required'),
body('orderer').notEmpty().withMessage('User Orderer ID Required'),
body('price').notEmpty().withMessage('Price is Required'),
body('price').isNumeric().withMessage('Price must be a number'),
validateRequest, 
async (req: Request, res: Response) => {
    const { job_id, orderer, price } = req.body;

    const user = await userDoc.findById(orderer);
    console.log(user);

    if(user.auth_verified === false){
        throw new BadRequestError('User must be verified!');
    }

    const order = await orderDoc.create(orderer, job_id, price);

    console.log(order);

    const job = await jobDoc.findById(job_id);
    console.log(job);
    const job_user = await userDoc.findById(job.job_created_by as string);
    console.log(job_user);
    const category = await categoryDoc.findById(job.job_category as string);
    console.log(category);
    const timeout = (new Date().getTime() + minutesToExpires) - new Date().getTime();

    //TODO: EMIT OrderCreatedEvent
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
        _v: order._v
    });

    if(order) return res.status(201).send(order);
    return res.status(500).send({ message: "Something wrong" })
});

export { router as createOrderRouter }