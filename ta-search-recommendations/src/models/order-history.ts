import { OrderStatus } from '@ta-vrilance/common';
import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// definition model firestore
@Collection()
export class OrderHistory {
    id: string;
    order_id: string;
    job_id: string;
    worker_id: string;
    hirer_id: string;
    order_status: OrderStatus;
    created_at: Date;
    category_id: string;
    category_name: string;
    _v: number;
}

const create = async (order_id: string, job_id: string, worker_id: string, hirer_id: string, order_status: OrderStatus, category_id: string, category_name: string) => {
    const repo = await getRepository(OrderHistory);
    const history = new OrderHistory();
    history.id = new mongoose.Types.ObjectId().toString();
    history.order_id = order_id;
    history.job_id = job_id;
    history.worker_id = worker_id;
    history.hirer_id = hirer_id;
    history.order_status = order_status;
    history.created_at = new Date();
    history.category_id = category_id;
    history.category_name = category_name;

    return await repo.create(history);
}

const confirmOrder = async (order_id: string) => {
    const repo = await getRepository(OrderHistory);
    const history = await repo.whereEqualTo('order_id', order_id).find();

    history[0].order_status = OrderStatus.Confirmed;

    await repo.update(history[0]);

    return history[0];
}

const getByHirerId = async (hirer_id: string) => {
    const repo = await getRepository(OrderHistory);
    const history = await repo.whereEqualTo('hirer_id', hirer_id).find();

    return history;
}

const getByWorkerId = async (worker_id: string) => {
    const repo = await getRepository(OrderHistory);
    const history = await repo.whereEqualTo('worker_id', worker_id).find();

    return history;
}

class OrderHistoryDoc {
    create: (order_id: string, job_id: string, worker_id: string, hirer_id: string, order_status: OrderStatus, category_id: string, category_name: string) => Promise<OrderHistory>;
    confirmOrder: (order_id: string) => Promise<OrderHistory>;
    getByHirerId: (hirer_id: string) => Promise<OrderHistory[]>;
    getByWorkerId: (worker_id: string) => Promise<OrderHistory[]>;
}

// declare functions
const historyDoc = new OrderHistoryDoc();
historyDoc.create = create;
historyDoc.confirmOrder = confirmOrder;
historyDoc.getByHirerId = getByHirerId;
historyDoc.getByWorkerId = getByWorkerId;

export default historyDoc;