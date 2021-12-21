import { Publisher, Subjects, CategoryCreatedEvent } from '@ta-vrilance/common';

export class CategoryCreatedPublisher extends Publisher<CategoryCreatedEvent> {
    subject: Subjects.CategoryCreated = Subjects.CategoryCreated;
}