import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader, validateRequest } from "@ta-vrilance/common";
import withdrawDoc, { WithdrawalStatus } from "../models/request-withdraw";
import userDoc from "../models/user";

const router = express.Router();

router.post('/api/payments/request/withdraw/:userId', 
body('amount').notEmpty().withMessage('Jumlah Wajib Diisi'),
validateHeader,
async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if(!userId) throw new BadRequestError('User ID Wajib Diisi');

    const pending = await withdrawDoc.getPendingRequest(userId);

    if(pending.length == 0){
        const withdraw = await withdrawDoc.create(userId, amount);

        if(withdraw){
            return res.send(withdraw);
        }else{
            throw new BadRequestError('Ada Yang Salah');
        }
    }else{
        throw new BadRequestError('Masih Terdapat Request Withdraw Yang Belum Selesai');
    }
});

router.get('/api/payments/withdraw/pending/:userId', validateHeader, async (req: Request, res: Response) => {
    const { userId } = req.params;
    if(!userId) throw new BadRequestError('User ID Wajib Diisi');

    const withdraws = await withdrawDoc.getPendingRequest(userId);
    return res.send(withdraws);
});

router.get('/api/payments/withdraw/:userId', validateHeader, async (req: Request, res: Response) => {
    const { userId } = req.params;
    if(!userId) throw new BadRequestError('User ID Wajib Diisi');

    const withdraws = await withdrawDoc.getByUserId(userId);
    return res.send(withdraws);
});

router.get('/api/payments/withdraw/byId/:id', validateHeader, async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const withdraw = await withdrawDoc.getById(id);
    return res.send(withdraw);
});

router.put('/api/payments/withdraw/accept/:id',
body('transfer_prove').notEmpty().withMessage("Bukti Wajib Diisikan"),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { id } = req.params;
    const { transfer_prove } = req.body;
    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const withdraw = await withdrawDoc.updateStatus(id, WithdrawalStatus.accepted, transfer_prove);
    await userDoc.updateSaldo(withdraw!.user_id, withdraw!.amount * -1);
    return res.send(withdraw);
});

router.put('/api/payments/withdraw/reject/:id',
validateHeader, 
async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const withdraw = withdrawDoc.updateStatus(id, WithdrawalStatus.rejected);
    return res.send(withdraw);
});

export { router as withdrawRouter }