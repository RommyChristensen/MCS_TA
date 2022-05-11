import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader } from "@ta-vrilance/common";
import userDoc from "../models/user";
import { OrderPaymentStatus } from "../models/order-payment-status";

const router = express.Router();

router.get('/api/payments/:user_id', 
validateHeader,
async (req: Request, res: Response) => {
    const user = req.params.user_id ? await userDoc.findById(req.params.user_id) : await userDoc.getAll();
    return res.send(user);
});

router.get('/api/payments/orderhistory/:userId', validateHeader, async (req: Request, res: Response) => {
    if(!req.params.userId) throw new BadRequestError('User ID Tidak Valid');

    const userId = req.params.userId;
    const user = await userDoc.findById(userId);

    if(user){
        const paidOrders = user.order_history.filter(o => o.status == OrderPaymentStatus.done);
        const unpaidOrders = user.order_history.filter(o => o.status == OrderPaymentStatus.pending);
        return res.send({
            paidOrders,
            unpaidOrders
        });
    }else{
        return res.status(404).send({ message: "User Tidak Ditemukan" });
    }
});

router.get('/api/payments/paymentdata/:userId', validateHeader, async (req: Request, res: Response) => {
    const { userId } = req.params;
    if(!userId) throw new BadRequestError('ID Pengguna Wajib Diisi');
    const paymentData = await userDoc.getPaymentData(userId);
    return res.send(paymentData);
});

export { router as getRouter }