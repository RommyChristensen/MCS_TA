import { Subjects } from "../subjects";
export interface CategoryDeletedEvent {
    subject: Subjects.CategoryDeleted;
    data: {
        id: string;
    };
}
