import { Subjects } from "../subjects";

export interface CategoryCreatedEvent {
    // set subject to be the name of the event
    subject: Subjects.CategoryCreated; 
    data: {
        id: string,
        category_name: string,
        category_description: string,
        _v: number
    }; 
}