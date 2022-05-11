import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import ratingReviewDoc from "../models/rating-review";
import { RatingReviewCreatedPublisher } from "../events/publishers/rating-review-created-publisher";

const router = express.Router();

router.post('/api/ratingreview',
validateHeader, 
body('order_id').notEmpty().withMessage('Order ID Required'),
body('orderer').notEmpty().withMessage('User Orderer ID Required'),
body('workerId').notEmpty().withMessage('Worker ID Wajib Diisi'),
body('rate').isNumeric().withMessage('Price must be a number'),
validateRequest, 
async (req: Request, res: Response) => {
    const { order_id, rate, review, orderer, workerId } = req.body;

    let order = await orderDoc.findByOrderer(orderer, order_id);

    if(order.length == 0){
        return res.status(404).send({ message: "User / Order not found" });
    }

    if(order[0].order_status !== OrderStatus.Confirmed){
        return res.status(400).send({ message: "Order not yet confirmed!" });
    }

    const rr = await ratingReviewDoc.create(order_id, rate, review, workerId);

    await orderDoc.changeReviewed(order_id);

    // EMIT RATING REVIEW CREATED EVENT
    new RatingReviewCreatedPublisher(natsWrapper.client).publish({
        order_id: order_id,
        _v: order[0]._v
    })

    return res.status(201).send(rr);
});

export { router as ratingReviewCreateRouter }