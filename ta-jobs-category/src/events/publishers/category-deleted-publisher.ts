import { Publisher, Subjects, CategoryDeletedEvent } from '@ta-vrilance/common';

export class CategoryDeletedPublisher extends Publisher<CategoryDeletedEvent> {
    subject: Subjects.CategoryDeleted = Subjects.CategoryDeleted;
}