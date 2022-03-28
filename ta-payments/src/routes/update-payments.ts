import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";

const router = express.Router();

interface JwtPayload {
    id: string
}

router.post('/api/payments/update-payments', 
validateHeader,
async (req: Request, res: Response) => {

});

export { router as updatePaymentsRouter }