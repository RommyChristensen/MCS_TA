import { Subjects } from "../subjects";
export interface OrderOnLocationEvent {
    subject: Subjects.OrderOnlocation;
    data: {
        id: string;
        _v: number;
    };
}
