import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, OrderStatus, validateHeader, validateRequest } from "@ta-vrilance/common";
import ratingReviewDoc from "../models/rating-review";

const router = express.Router();

router.get('/api/ratingreview/:orderId',
validateHeader, 
async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if(!orderId) throw new BadRequestError('Order ID Required');

    const rating = await ratingReviewDoc.findByOrderId(orderId);

    return res.send(rating);
});

router.get('/api/ratingreview/:userId', 
validateHeader, 
async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    if(userId){
        const ratings = await ratingReviewDoc.findByWorkerId(userId);
        let rating = 0;
        const count = ratings.length;

        if(count == 0){
            return res.status(404).send({ message: "Pekerja belum mempunyai rating" });
        }

        ratings.forEach(r => {
            rating += parseInt(r.rate.toString());
        });

        rating = rating / count;

        if(rating % 1 > 0.5){
            rating = parseInt(rating.toString()) + 0.5;
        }else{
            rating = parseInt(rating.toString());
        }

        return res.send({ data: { rating }, code: 200});
    }

    throw new BadRequestError('ID User Wajib Disertakan');
});

export { router as getRatingReviewRouter }