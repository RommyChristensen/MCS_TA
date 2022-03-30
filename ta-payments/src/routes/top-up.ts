import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import { coreApiClient } from "../helpers/v-midtrans-client";

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

    if(payment_type == PaymentType.BANK){
        // let parameter = {
        //     "payment_type": "bank_transfer",
        //     "bank_transfer": {
        //         "bank": "permata"
        //     },
        //     "transaction_details": {
        //         "order_id": "C17550",
        //         "gross_amount": 145000
        //     },
        //     "custom_field1": "custom field 1 content",
        //     "custom_field2": "custom field 2 content",
        //     "custom_field3": "custom field 3 content"
        // };
        paymentParameter = {
            payment_type: payment_type,
            transaction_details: {
                order_id: order_id,
                gross_amount: value
            },
            bank_transfer: {
                bank: payment_type_detail
            },
            user_id: user_id
        }
    }else if(payment_type == PaymentType.CC){

    }

    coreApiClient.charge(paymentParameter).then((chargeResponse: string) => {
        return res.send(chargeResponse);
    });
});

export { router as topUpRouter }