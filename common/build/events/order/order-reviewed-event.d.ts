import { Subjects } from "../subjects";
export interface OrderReviewedEvent {
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
