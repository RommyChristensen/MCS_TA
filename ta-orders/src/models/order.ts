import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';
import { OrderStatus } from '@ta-vrilance/common';
import { User } from './user';
import { Job } from './job';

// definition model firestore
@Collection()
class Order {
    id: string;
    orderer_id: string | User;
    job_id: string | Job;
    order_status: OrderStatus;
    order_price: number;
    order_date: Date | null;
    order_rejected_at: Date | null;
    order_accepted_at: Date | null;
    order_cancelled_at: Date | null;
    order_expired_at: Date| null;
    order_done_at: Date | null;
    order_on_location_at: Date | null;
    order_created_at: Date;
    order_location: string;
    order_type: number;
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (orderer_id: string | User, job_id: string | Job, order_price: number, order_date: Date, order_location: string, order_type: number) => {
    const repo = await getRepository(Order);
    const order = new Order();
    order.id = new mongoose.Types.ObjectId().toString();
    order.order_price = order_price;
    order.orderer_id = orderer_id;
    order.job_id = job_id;
    order.order_status = OrderStatus.Created;
    order.order_rejected_at = null;
    order.order_accepted_at = null;
    order.order_cancelled_at = null;
    order.order_done_at = null;
    order.order_created_at = new Date();
    order.order_date = order_date;
    order.order_expired_at = null;
    order.order_on_location_at = null;
    order.order_location = order_location;
    order.order_type = order_type;
    order._v = 0;

    return await repo.create(order);
}

const findByUserId = async (userId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.whereEqualTo('orderer_id', userId).find();
    return order;
}

const getAll = async () => {
    const repo = await getRepository(Order);
    const order = await repo.find();

    return order;
}

const getWorkerType2 = async (workerId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.whereEqualTo('order_type', 2).whereEqualTo('orderer_id', workerId).find();

    return order;
}

const getType2 = async () => {
    const repo = await getRepository(Order);
    const order = await repo.whereEqualTo('order_type', 2).find();

    return order;
}

const deleteAll = async () => {
    const repo = await getRepository(Order);
    const order = await repo.find();

    order.forEach(async o => {
        return repo.delete(o.id);
    });

    return true;
}

const findById = async (orderId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    return order;
}

const deleteById = async (orderId: string) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);
    await repo.delete(orderId);

    if(await repo.findById(orderId)){
        return false;
    }else{
        return order;
    }
}

const changeStatus = async (orderId: string, status: OrderStatus) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    order.order_status = status;

    if(status === OrderStatus.Expired){
        order.order_expired_at = new Date();
    }else if(status === OrderStatus.Accepted){
        order.order_accepted_at = new Date();
    }else if(status === OrderStatus.Cancelled){
        order.order_cancelled_at = new Date();
    }else if(status === OrderStatus.Done){
        order.order_done_at = new Date();
    }else if(status === OrderStatus.Rejected){
        order.order_rejected_at = new Date();
    } else if(status === OrderStatus.OnLocation){
        order.order_on_location_at = new Date();
    }

    const updatedOrder = await repo.update(order);
    return updatedOrder;
}

const update = async (orderId: string, price: number) => {
    const repo = await getRepository(Order);
    const order = await repo.findById(orderId);

    order.order_price = price;

    const updatedOrder = await repo.update(order);
    return updatedOrder;
}

// --------------------- End custom functions ------------------------------ //

// make class JobDoc singleton
class OrderDoc {
    create: (orderer_id: string | User, job_id: string | Job, order_price: number, order_date: Date, order_location: string, order_type: number) => Promise<Order>;
    findByUserId: (userId: string) => Promise<Order[]>;
    getAll: () => Promise<Order[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (jobId: string) => Promise<Order>;
    deleteById: (jobId: string) => Promise<false | Order>;
    updateJob: (jobId: string, title: string, description: string, price: number, date: Date) => Promise<Order>;
    changeStatus: (orderId: string, status: OrderStatus) => Promise<Order>;
    update: (orderId: string, price: number) => Promise<Order>;
    getWorkerType2: (workerId: string) => Promise<Order[]>;
    getType2: () => Promise<Order[]>;
}

// declare functions
const orderDoc = new OrderDoc();
orderDoc.create = create;
orderDoc.findByUserId = findByUserId;
orderDoc.findById = findById;
orderDoc.getAll = getAll;
orderDoc.deleteAll = deleteAll;
orderDoc.deleteById = deleteById;
orderDoc.changeStatus = changeStatus;
orderDoc.update = update;
orderDoc.getWorkerType2 = getWorkerType2;
orderDoc.getType2 = getType2;

export default orderDoc;