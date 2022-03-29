import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { coreApiClient } from "../helpers/v-midtrans-client";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/payments/topup', 
validateHeader,
async (req: Request, res: Response) => {
    let parameter = {
        "payment_type": "bank_transfer",
        "bank_transfer": {
            "bank": "permata"
        },
        "transaction_details": {
            "order_id": "C17550",
            "gross_amount": 145000
        },
        "custom_field1": "custom field 1 content",
        "custom_field2": "custom field 2 content",
        "custom_field3": "custom field 3 content"
    };
    

    coreApiClient.charge(parameter).then((chargeResponse: string) => {
        return res.send(chargeResponse);
    });
});

export { router as topUpRouter }