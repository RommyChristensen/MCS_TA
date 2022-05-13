import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader, validateRequest } from "@ta-vrilance/common";
import adsDoc from "../models/ads";
import { AdsStatus } from "../models/ads-status";

const router = express.Router();

router.get('/api/ads/all', validateHeader, async (req: Request, res: Response) => {
    const ads = await adsDoc.getAll();
    return res.send(ads);
});

router.get('/api/ads/bystatus/:status', validateHeader, async (req: Request, res: Response) => {
    const { status } = req.params;

    if(!status) throw new BadRequestError('Status Wajib Diisi');

    if(status != AdsStatus.Active && status != AdsStatus.Rejected && status != AdsStatus.Requested && status != AdsStatus.NonActive){
        const ads = await adsDoc.getAdsByStatus(status as AdsStatus);
        return res.send(ads);
    }

    throw new BadRequestError('Status Salah');
});

router.get('/api/ads/bycategoryid/:id', validateHeader, async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const ads = await adsDoc.getByCategoryId(id);

    return res.send(ads);
});

router.post('/api/ads/bycategories', validateHeader, async (req: Request, res: Response) => {
    const { listCategory } = req.body;

    const ads = await adsDoc.getByCategoryIds(listCategory);

    return res.send(ads);
});

router.get('/api/ads/byworkerid/:worker_id', validateHeader, async (req: Request, res: Response) => {
    const { worker_id } = req.params;

    if(!worker_id) throw new BadRequestError('ID Wajib Diisi');

    const ads = await adsDoc.getByWorkerId(worker_id);

    return res.send(ads);
});

export { router as getAdsRouter }