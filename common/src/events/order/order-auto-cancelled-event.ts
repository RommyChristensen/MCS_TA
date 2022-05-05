import { Subjects } from "../subjects";

export interface OrderAutoCancelledEvent {
    // set subject to be the name of the event
    subject: Subjects.OrderAutoCancelled; 
    data: {
        id: string; // order id
        order_date: Date;
        cancel_code: number; // 1. cancelled karena lewat 30 menit setelah jadwal pekerjaan (tidak dilakukan update status on progress)
        _v: number;
    }; 
}