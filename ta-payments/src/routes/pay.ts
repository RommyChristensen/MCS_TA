import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader } from "@ta-vrilance/common";
import userDoc from "../models/user";
import { OrderPaidPublisher } from "../events/publishers/order-paid-publisher";
import { natsWrapper } from "../nats-wrapper";
import { OrderPaymentStatus } from "../models/order-payment-status";

const router = express.Router();

router.post('/api/payments/pay',
body('order_id').notEmpty().withMessage("Order ID Wajib Diisi"),
body('hirer_id').notEmpty().withMessage("Hirer ID Wajib Diisi"),
body('worker_id').notEmpty().withMessage("Worker ID Wajib Diisi"),
body('price').notEmpty().withMessage("Harga Wajib Diisi"),
validateHeader, 
async (req: Request, res: Response) => {
    const { hirer_id, worker_id, order_id, price } = req.body;

    const hirer = await userDoc.findById(hirer_id);
    const worker = await userDoc.findById(worker_id);

    const order = hirer.order_history.filter(o => {
        return o.order_id == order_id;
    });

    if(order[0].status == OrderPaymentStatus.done){
        throw new BadRequestError('Pesanan Sudah Terbayar');
    }

    if(hirer.auth_saldo - parseInt(price) >= 0){
        await userDoc.updateSaldo(hirer.id, parseInt(price) * -1);
        await userDoc.updateSaldo(worker.id, parseInt(price));

        await userDoc.updateOrderHistory(order_id, hirer_id);
        await userDoc.updateOrderHistory(order_id, worker_id);

        new OrderPaidPublisher(natsWrapper.client).publish({
            id: order_id,
            _v: 0,
        })

        return res.send({ message: "Sukses" });
    }else{
        throw new BadRequestError("Saldo Tidak Mencukupi");
    }
});

export { router as payRouter }