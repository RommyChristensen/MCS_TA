import { Subjects } from "../subjects";

export interface CategoryDeletedEvent {
    // set subject to be the name of the event
    subject: Subjects.CategoryDeleted; 
    data: {
        id: string
    };
}