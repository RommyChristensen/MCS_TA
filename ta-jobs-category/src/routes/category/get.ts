import express, { Request, Response } from 'express';
import categoryDoc from '../../models/category';
import { checkHeaderAdmin } from '../../middlewares/validate-header-admin';
import { Error } from 'mongoose';
import { validateHeader } from '@ta-vrilance/common';

const router = express.Router();

router.get('/api/jobscat/admin/category',
checkHeaderAdmin,
async (req: Request, res: Response) => {
    const cats = await categoryDoc.getAll()
    
    if(cats){
        return res.status(200).send(cats);
    }else{
        throw new Error('Get Data Category Failed');
    }
});

router.get('/api/jobscat/category',
validateHeader,
async (req: Request, res: Response) => {
    const cats = await categoryDoc.getAll()
    
    if(cats){
        return res.status(200).send(cats);
    }else{
        throw new Error('Get Data Category Failed');
    }
});

export { router as getCategoryRouter };