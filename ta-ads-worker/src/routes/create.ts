import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import adsDoc from "../models/ads";

const router = express.Router();

router.post('/api/ads',
body('worker_id').notEmpty().withMessage('ID Pekerja Wajib Diisi'),
body('title').notEmpty().withMessage('Judul Iklan Wajib Diisi'),
body('description').notEmpty().withMessage('Deskripsi Iklan Wajib Diisi'),
body('category_id').notEmpty().withMessage('ID Kategori Wajib Diisi'),
body('category_name').notEmpty().withMessage('Nama Kategori Wajib Diisi'),
async (req: Request, res: Response) => {
    const { worker_id, title, description, category_id, category_name } = req.body;

    const ads = await adsDoc.create(worker_id, title, description, category_id, category_name);
    
    if(ads){
        return res.status(201).send(ads);
    }else{
        return res.status(500).send({ message: "Ada Yang Salah" });
    }
});

export { router as createAdsRouter }