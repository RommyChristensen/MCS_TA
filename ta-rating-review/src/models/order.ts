import { Collection, getRepository } from 'fireorm';
import { OrderStatus } from '@ta-vrilance/common';

// definition model firestore
@Collection()
class Order {
    id: string;
    job: {
        id: string;
        job_title: string;
        job_description: string;
        category: {
            id: string;
            category_name: string;
        };
        user: {
            id: string;
            auth_firstname: string;
            auth_lastname: string;
        }
    }
    user: {
        id: string;
        auth_firstname: string;
        auth_lastname: string;
    };
    order_status: OrderStatus;
    order_confirmed_at: Date | null;
    order_price: number;
    _v: number;
}

interface Job {
    id: string;
    job_title: string;
    job_description: string;
    category: {
        id: string;
        category_name: string;
    };
    user: {
        id: string;
        auth_firstname: string;
        auth_lastname: string;
    }
}

interface User {
    id: string;
    auth_firstname: string;
    auth_lastname: string;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (id: string, job: Job, user: User, order_status: OrderStatus, order_price: number, _v: number, order_confirmed_at: Date | null) => {
    const repo = await getRepository(Order);
    const order = new Order();
    order.id = id;
    order.job = job;
    order.user = user;
    order.order_status = order_status;
    order.order_price = order_price;
    order._v = _v;
    order.order_confirmed_at = order_confirmed_at;

    return await repo.create(order);
}

const findById = async (orderId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    return order;
}

const changeConfirmed = async (orderId: string, status: OrderStatus) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    order.order_status = status;

    const updatedOrder = await repo.update(order);
    return updatedOrder;
}

const changeReviewed = async (orderId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    order.order_status = OrderStatus.Reviewed;

    const updatedOrder = await repo.update(order);
    return updatedOrder;
}

const update = async (orderId: string, price: number) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    order.order_price = price;
    order.order_confirmed_at = new Date();
    order.order_status = OrderStatus.Reviewed;

    const updatedOrder = await repo.update(order);
    return updatedOrder;
}

const findByOrderer = async (orderer_id: string, order_id: string) => {
    const repo = await getRepository(Order);
    const order = await repo.whereEqualTo(o => o.user.id, orderer_id).whereEqualTo(o => o.id, order_id).find();
    return order;
}

// --------------------- End custom functions ------------------------------ //

// make class JobDoc singleton
class OrderDoc {
    create: (id: string, job: Job, user: User, order_status: OrderStatus, order_price: number, _v: number, order_done_at: Date | null) => Promise<Order>;
    findById: (jobId: string) => Promise<Order>;
    changeConfirmed: (orderId: string, status: OrderStatus) => Promise<Order>;
    update: (orderId: string, price: number) => Promise<Order>;
    findByOrderer: (orderer_id: string, order_id: string) => Promise<Order[]>;
    changeReviewed: (orderId: string) => Promise<Order>;
}

// declare functions
const orderDoc = new OrderDoc();
orderDoc.create = create;
orderDoc.findById = findById;
orderDoc.changeConfirmed = changeConfirmed;
orderDoc.update = update;
orderDoc.findByOrderer = findByOrderer;
orderDoc.changeReviewed = changeReviewed;

export default orderDoc;