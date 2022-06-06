import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import { body } from "express-validator";
import ratingReviewDoc from "../models/rating-review";

const router = express.Router();

function compareByRating( a: any, b: any ) {
    if ( a.rate < b.rate ){
      return -1;
    }
    if ( a.rate > b.rate ){
      return 1;
    }
    return 0;
}

router.post('/api/ratingreview/admin/reportuser',
body('users').notEmpty().withMessage('List of Users Required'),
validateRequest,
validateHeader,
async (req: Request, res: Response) => {
    const { users } = req.body;

    await Promise.all(users.map(async (u: string) => {
        const ratings = await ratingReviewDoc.findByWorkerId(u);
        let stars = 0;

        ratings.forEach(r => {
            stars += parseInt(r.rate.toString());
        });

        if(ratings.length > 0){
            const r = {
                userId: u,
                rate: stars / ratings.length
            }
            return r;
        }
    })).then(result => {
        return res.status(200).send(result.sort(compareByRating).reverse());
    })
});

export { router as reportRatingRouter }