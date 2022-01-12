import { Subjects } from "../subjects";
export interface RatingReviewCreatedEvent {
    subject: Subjects.RatingReviewCreated;
    data: {
        order_id: string;
        _v: number;
    };
}
