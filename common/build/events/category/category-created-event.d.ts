import { Subjects } from "../subjects";
export interface CategoryCreatedEvent {
    subject: Subjects.CategoryCreated;
    data: {
        id: string;
        category_name: string;
        category_description: string;
        _v: number;
    };
}
