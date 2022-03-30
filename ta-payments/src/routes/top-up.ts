import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import { coreApiClient } from "../helpers/v-midtrans-client";
import { BCAInterface } from "../interfaces/bca-interface";
import { Bank } from "../enums/bank";
import { BNIInterface } from "../interfaces/bni-interface";
import { PermataInterface } from "../interfaces/permata-interface";
import userDoc from "../models/user";

const router = express.Router();

interface JwtPayload {
    id: string
}

enum PaymentType {
    BANK = "bank_transfer",
    CC = "credit_card",
}

router.post('/api/payments/topup', 
validateHeader,
body('value').notEmpty().withMessage('Please enter a top up value!'),
body('value').isNumeric().withMessage('Top Up Value must be a valid number'),
body('payment_type').notEmpty().withMessage('Please enter a payment type'),
body('payment_type_detail').notEmpty().withMessage('Please enter a payment type detail, like bank / credit card details'),
body('order_id').notEmpty().withMessage('Please enter an order id'),
body('user_id').notEmpty().withMessage("Please enter a user id"),
validateRequest,
async (req: Request, res: Response) => {
    const { payment_type, payment_type_detail, value, order_id, user_id } = req.body;
    let paymentParameter = {};
    let newOrderId = order_id+new Date().getTime().toString();

    if(payment_type == PaymentType.BANK){
        paymentParameter = {
            payment_type: payment_type,
            transaction_details: {
                order_id: newOrderId,
                gross_amount: value
            },
            bank_transfer: {
                bank: payment_type_detail
            },
            custom_field1: user_id,
            custom_field2: payment_type_detail
        }
    }else if(payment_type == PaymentType.CC){

    }

    if(payment_type == "bank_transfer"){
        if(payment_type_detail == Bank.BCA){
            coreApiClient.charge(paymentParameter).then(async (chargeResponse: BCAInterface) => {
                await userDoc.addCurrentTransaction(chargeResponse, user_id);
                await userDoc.addNewTransaction(user_id, value, payment_type, newOrderId, chargeResponse.transaction_time, chargeResponse.transaction_status);
                return res.send(chargeResponse);
            });
        }else if(payment_type_detail == Bank.BNI){
            coreApiClient.charge(paymentParameter).then(async (chargeResponse: BNIInterface) => {
                await userDoc.addCurrentTransaction(chargeResponse, user_id);
                await userDoc.addNewTransaction(user_id, value, payment_type, newOrderId, chargeResponse.transaction_time, chargeResponse.transaction_status);
                return res.send(chargeResponse);
            });
        }else if(payment_type_detail == Bank.PERMATA){
            coreApiClient.charge(paymentParameter).then(async (chargeResponse: PermataInterface) => {
                await userDoc.addCurrentTransaction(chargeResponse, user_id);
                await userDoc.addNewTransaction(user_id, value, payment_type, newOrderId, chargeResponse.transaction_time, chargeResponse.transaction_status);
                return res.send(chargeResponse);
            });
        }
    }
});

export { router as topUpRouter }