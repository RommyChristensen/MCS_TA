import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import orderDoc from "../models/order";

const router = express.Router();

router.post('/api/orders/admin/reportorder/byMonth',
validateHeader, 
body('month').notEmpty().withMessage('Month Required'),
validateRequest,
async (req: Request, res: Response) => {
    const { month } = req.body;
    const orderByMonth = await orderDoc.getByMonth(month);

    return res.send(orderByMonth);
});

router.post('/api/orders/admin/reportorder/by6Month/:type',
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { type } = req.params;
    const orderBy6Month = await orderDoc.getAll();

    const a = new Date(new Date().getFullYear(), 0, 1);
    const b = new Date(new Date().getFullYear(), 6, 1);
    const c = new Date(new Date().getFullYear(), 11, 31);

    const filtered = orderBy6Month.filter(o => {
        const d = new Date(o.order_created_at);
        if(type == '0'){
            if(d >= a && d < b){
                return true;
            }else{
                return false;
            }
        }else{
            if(d >= b && d <= c){
                return true;
            }else{
                return false;
            }
        }
    })

    return res.send(filtered);
});


export { router as orderReportRouter }