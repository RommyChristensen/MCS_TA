import { body } from "express-validator";
import express, { Request, Response } from "express";
import userDoc, { DetailPaymentData } from "../models/user";
import { BadRequestError, CustomError, validateHeader, validateRequest } from "@ta-vrilance/common";

const router = express.Router();

router.get('/api/payments/admin/reportuser',
validateHeader,
async (req: Request, res: Response) => {
    const users = await userDoc.getBySaldo();

    return res.send(users);
});

export { router as reportUserRouter }