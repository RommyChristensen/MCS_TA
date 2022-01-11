import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';
import { OrderStatus } from '@ta-vrilance/common';

// definition model firestore
@Collection()
class RatingReview {
    id: string;
    order_id: string;
    rate: number;
    review: string;
    user_id: string;
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (order_id: string, rate: number, review: string, user_id: string) => {
    const repo = await getRepository(RatingReview);
    const rr = new RatingReview();
    rr.id = new mongoose.Types.ObjectId().toString();
    rr.order_id = order_id;
    rr.rate = rate;
    rr.review = review;
    rr.user_id = user_id;
    rr._v = 0;

    return await repo.create(rr);
}

const findById = async (rrId: string) => {
    const repo = await getRepository(RatingReview);
    const rr = await repo.findById(rrId);

    return rr;
}

const getAll = async () => {
    const repo = await getRepository(RatingReview);
    const rr = await repo.find();

    return rr;
}

const findByReviewer = async (reviewer_id: string) => {
    const repo = await getRepository(RatingReview);
    const rr = await repo.whereEqualTo(r => r.user_id, reviewer_id).find();
    return rr;
}

// --------------------- End custom functions ------------------------------ //

// make class JobDoc singleton
class RatingReviewDoc {
    create: (order_id: string, rate: number, review: string, user_id: string) => Promise<RatingReview>;
    findByReviewer: (reviewer_id: string) => Promise<RatingReview[]>;
    getAll: () => Promise<RatingReview[]>;
}

// declare functions
const ratingReviewDoc = new RatingReviewDoc();
ratingReviewDoc.create = create;
ratingReviewDoc.findByReviewer = findByReviewer;
ratingReviewDoc.getAll = getAll;

export default ratingReviewDoc;