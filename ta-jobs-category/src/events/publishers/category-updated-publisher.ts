import { Publisher, Subjects, CategoryUpdatedEvent } from '@ta-vrilance/common';

export class CategoryUpdatedPublisher extends Publisher<CategoryUpdatedEvent> {
    subject: Subjects.CategoryUpdated = Subjects.CategoryUpdated;
}