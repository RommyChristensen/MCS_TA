import { body } from "express-validator";
import express, { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError, validateHeader, validateRequest } from "@ta-vrilance/common";
import adsDoc from "../models/ads";
import jwt from 'jsonwebtoken';
import { AdsStatus } from "../models/ads-status";

const router = express.Router();

const checkHeader = (req: Request, res: Response, next: NextFunction) => {
    if(!req.header('admin-session-key')){
        throw new BadRequestError('Not Authorized');
    }

    try{
        jwt.verify(req.header('admin-session-key')!, process.env.JWT_KEY!);
    }catch(ex){
        throw new BadRequestError('Invalid Token');
    }

    next();
}

router.put('/api/ads/:id', checkHeader, async (req: Request, res: Response) => {
    const { id } = req.params;

    if(!id) throw new BadRequestError('ID Wajib Diisi');

    if(!await adsDoc.getById(id)) throw new NotFoundError();

    const updatedAds = await adsDoc.changeStatus(id, AdsStatus.Active);

    return res.send(updatedAds);
});

export { router as confirmAdsRouter }