import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { Bank } from "../enums/bank";
import { BCAInterface } from "../interfaces/bca-interface";
import userDoc from "../models/user";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/payments/update-payments', 
async (req: Request, res: Response) => {
    if(req.body["custom_field2"] == Bank.BCA){
        const notif = req.body as BCAInterface;
        await userDoc.updateTransaction(notif.custom_field1, notif.transaction_status, notif.order_id);
        await userDoc.removeCurrentTransaction(notif.custom_field1);
    }
    return res.send(req.body);
});

export { router as updatePaymentsRouter }