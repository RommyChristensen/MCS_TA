import { Subjects } from "../subjects";
export interface OrderDoneEvent {
    subject: Subjects.OrderDone;
    data: {
        id: string;
        _v: number;
    };
}
