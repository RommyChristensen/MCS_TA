import { Subjects } from "../subjects";
export interface CategoryUpdatedEvent {
    subject: Subjects.CategoryUpdated;
    data: {
        id: string;
        category_name: string;
        category_description: string;
        _v: number;
    };
}
