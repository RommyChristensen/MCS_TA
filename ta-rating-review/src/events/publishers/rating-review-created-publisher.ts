import { Publisher, Subjects, RatingReviewCreatedEvent } from '@ta-vrilance/common';

export class RatingReviewCreatedPublisher extends Publisher<RatingReviewCreatedEvent> {
    subject: Subjects.RatingReviewCreated = Subjects.RatingReviewCreated;
}