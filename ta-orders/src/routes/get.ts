import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import orderDoc from '../models/order';
import { BadRequestError, validateHeader } from '@ta-vrilance/common';

const router = express.Router();

router.get('/api/orders/admin/get/:orderId', async (req: Request, res: Response) => {
    //TODO: GET ORDERS ADMIN
    return res.send(true);
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

    return res.send(orders);
});

export { router as orderGetRouter };