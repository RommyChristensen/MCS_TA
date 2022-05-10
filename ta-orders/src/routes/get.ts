import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import orderDoc from '../models/order';
import jobDoc, { Job } from '../models/job';
import { BadRequestError, OrderStatus, validateHeader } from '@ta-vrilance/common';

const router = express.Router();

router.get('/api/orders/admin/get/:orderId', async (req: Request, res: Response) => {
    //TODO: GET ORDERS ADMIN
    return res.send(true);
});

router.get('/api/orders/type2/worker/:workerId', validateHeader, async (req: Request, res: Response) => {
    const { workerId } = req.params;

    if(!workerId) throw new BadRequestError('ID Pekerja Tidak Valid');

    const orders = await orderDoc.getWorkerType2(workerId);

    const filteredOrders = orders.filter(o => {
        return o.order_status != OrderStatus.Confirmed && o.order_status != OrderStatus.Expired && o.order_status != OrderStatus.Rejected && o.order_status != OrderStatus.Cancelled;
    });

    await Promise.all(filteredOrders.map(async (order) => {
        let job = await jobDoc.findById(order.job_id.toString());

        order["job_id"] = job;

        return order;
    })).then(result => {
        return res.status(200).send(result);
    });

    return res.send(filteredOrders);
});

router.get('/api/orders/type2/hirer/:hirerId', validateHeader, async (req: Request, res: Response) => {
    const { hirerId } = req.params;

    if(!hirerId) throw new BadRequestError('ID Pencari Jasa Tidak Valid');

    const orders = await orderDoc.getType2();

    const filteredOrders = orders.filter(o => {
        return o.order_status != OrderStatus.Confirmed && o.order_status != OrderStatus.Expired && o.order_status != OrderStatus.Rejected && o.order_status != OrderStatus.Cancelled;
    });

    await Promise.all(filteredOrders.map(async (order) => {
        let job = await jobDoc.findById(order.job_id.toString());

        order["job_id"] = job;

        if(job.job_created_by == hirerId) return order;
        else return null;
    })).then(result => {
        const r = result.filter(re => {
            return re != null;
        });
        return res.status(200).send(r);
    });
});

router.get('/api/orders/:orderId',
validateHeader,
async (req: Request, res: Response) => {
    const { orderId } = req.params;

    if(!orderId){
        throw new BadRequestError("Order ID Wajib Disertakan");
    }

    const order = await orderDoc.findById(orderId);

    if(!order){
        throw new BadRequestError("Data Order Tidak Ditemukan");
    }

    return res.send(order);
});

router.get('/api/orders/hirer/:hirerId', validateHeader, async (req: Request, res: Response) => {
    const { hirerId } = req.params;

    const orders = await orderDoc.getAll();

    await Promise.all(orders.map(async (order) => {
        let job = await jobDoc.findById(order.job_id.toString());

        order["job_id"] = job;

        if(job.job_created_by == hirerId) return order;
        else return null;
    })).then(result => {
        const r = result.filter(re => {
            return re != null;
        });
        return res.status(200).send(r);
    });
});

router.get('/api/orders/worker/:workerId',
validateHeader,
async (req: Request, res: Response) => {
    const { workerId } = req.params;

    if(!workerId){
        throw new BadRequestError("Data Pengguna Wajib Disertakan");
    }

    const user = await userDoc.findById(workerId);

    if(!user){
        return res.status(404).send({ message: "Pengguna Tidak Ditemukan" });
    }

    const orders = await orderDoc.findByUserId(workerId);

    await Promise.all(orders.map(async (order) => {
        let job = await jobDoc.findById(order.job_id.toString());
        order['job_id'] = job;

        return order;
    })).then(result => {
        return res.status(200).send(result);
    });
});

export { router as orderGetRouter };