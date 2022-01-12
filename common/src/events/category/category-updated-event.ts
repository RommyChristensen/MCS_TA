import { Subjects } from "../subjects";

export interface CategoryUpdatedEvent {
    // set subject to be the name of the event
    subject: Subjects.CategoryUpdated; 
    data: {
        id: string,
        category_name: string,
        category_description: string,
        _v: number
    }; 
}