import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader } from "@ta-vrilance/common";
import userDoc from "../models/user";
import { OrderPaidPublisher } from "../events/publishers/order-paid-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    if(hirer.auth_saldo - parseInt(price) >= 0){
        await userDoc.updateSaldo(hirer.id, parseInt(price) * -1);
        await userDoc.updateSaldo(worker.id, parseInt(price));

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