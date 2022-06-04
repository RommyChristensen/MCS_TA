import { body } from "express-validator";
import express, { Request, Response } from "express";
import userDoc, { DetailPaymentData } from "../models/user";
import { BadRequestError, CustomError, validateHeader, validateRequest } from "@ta-vrilance/common";

const router = express.Router();

function compareBySaldo( a: any, b: any ) {
    if ( a.auth_saldo < b.auth_saldo ){
      return -1;
    }
    if ( a.auth_saldo > b.auth_saldo ){
      return 1;
    }
    return 0;
}

router.get('/api/payments/admin/reportuser',
validateHeader,
async (req: Request, res: Response) => {
    const users = await userDoc.getBySaldo();

    users.sort(compareBySaldo);

    return res.send(users);
});

export { router as reportUserRouter }