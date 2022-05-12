import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader } from "@ta-vrilance/common";
import { natsWrapper } from "../nats-wrapper";
import historyDoc, { OrderHistory } from "../models/order-history";

const router = express.Router();

router.get('/api/searchrecommendation/hirer/cat/recom/:hirer_id',
validateHeader,
async (req: Request, res: Response) => {
    const { hirer_id } = req.params;
    if(!hirer_id) throw new BadRequestError('ID Wajib Diisi');

    const history = await historyDoc.getByHirerId(hirer_id);

    const categories = history.reduce((h, k) => {
        h[k.category_id] = h[k.category_id] || [];
        h[k.category_id].push(k);
        return h;
    }, Object.create(null));

    return res.send(categories);
});

router.get('/api/searchrecommendation/worker/cat/recom/:worker_id',
validateHeader,
async (req: Request, res: Response) => {
    const { worker_id } = req.params;
    if(!worker_id) throw new BadRequestError('ID Wajib Diisi');

    const history = await historyDoc.getByWorkerId(worker_id);

    const c = history.reduce((h, k) => {
        h[k.category_id] = h[k.category_id] || [];
        h[k.category_id].push(k);
        return h;
    }, Object.create(null));

    let categories = [];

    for (var key of Object.keys(c)) {
        categories.push({
            [key]: c[key],
            l: c[key].length
        })
    }

    const sorted = categories.sort((a: { [x:string] :any[], l: any}, b: { [x:string] :any[], l: any}) => {
        if(a.l > b.l) return -1;
        else if(a.l < b.l) return 1;
        return 0;
    });

    return res.send({ categories, sorted });
});

export { router as recommendationsRouter }