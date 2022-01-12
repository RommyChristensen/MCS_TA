import { Subjects } from "../subjects";
export interface OrderOnprogressEvent {
    subject: Subjects.OrderOnprogress;
    data: {
        id: string;
        _v: number;
    };
}
