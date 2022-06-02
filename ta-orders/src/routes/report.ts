import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";

const router = express.Router();

// router.post('/api/orders/admin/reportorder',
// validateHeader, 
// body('month').notEmpty().withMessage('Month Required'),
// validateRequest,
// async (req: Request, res: Response) => {
//     const { month } = req.body;
//     const orderByMonth = await orderDoc.getByMonth(month);

//     return res.send(orderByMonth);
// });

export { router as orderReportRouter }