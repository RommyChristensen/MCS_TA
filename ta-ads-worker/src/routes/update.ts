import { body } from "express-validator";
import express, { Request, Response } from "express";
import { BadRequestError, validateHeader, validateRequest } from "@ta-vrilance/common";
import adsDoc from "../models/ads";

const router = express.Router();

router.put('/api/ads/:id', validateHeader, async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { id } = req.params;

    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const updatedAds = await adsDoc.updateAds(id, title, description);

    return res.send(updatedAds);
});

export { router as updateAdsRouter }