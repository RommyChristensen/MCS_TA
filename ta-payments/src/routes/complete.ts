import { body } from "express-validator";
import express, { Request, Response } from "express";
import userDoc, { DetailPaymentData } from "../models/user";
import { BadRequestError, CustomError, validateHeader } from "@ta-vrilance/common";

const router = express.Router();

router.post('/api/payments/complete/:userId', 
body('card_number').notEmpty().withMessage('Nomor Rekening Wajib Diisi'),
body('card_name').notEmpty().withMessage('Nama Wajib Diisi'),
body('bank').notEmpty().withMessage('Bank Wajib Diisi'),
validateHeader,
async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { card_number, card_name, bank } = req.body;

    if(!userId) throw new BadRequestError('User ID Wajib Diisi');

    const user = await userDoc.updatePaymentData(userId, card_name, card_number, bank);

    if(user){
        return res.send(user);
    }else{
        throw new BadRequestError('Ada Yang Salah');
    }
});

export { router as completePaymentDataRouter }