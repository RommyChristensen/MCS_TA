import { Subjects } from "../subjects";

export interface RatingReviewCreatedEvent {
    // set subject to be the name of the event
    subject: Subjects.RatingReviewCreated; 
    data: {
        order_id: string,
        _v: number
    }; 
}