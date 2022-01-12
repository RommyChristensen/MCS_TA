import { Subjects } from "../subjects";

export interface OrderReviewedEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderReviewed; 
    data: {
        id: string;
        star: number;
        review: string;
        reviewer: string;
        reviewed: string;
        _v: number;
    }; 
}