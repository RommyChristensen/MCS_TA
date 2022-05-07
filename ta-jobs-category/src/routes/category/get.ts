import express, { Request, Response } from 'express';
import categoryDoc from '../../models/category';
import { checkHeaderAdmin } from '../../middlewares/validate-header-admin';
import { Error } from 'mongoose';
import { validateHeader } from '@ta-vrilance/common';
import userDoc from '../../models/user';

const router = express.Router();

router.get('/api/jobscat/admin/category/',
checkHeaderAdmin,
async (req: Request, res: Response) => {
    const cats = await categoryDoc.getAll();
    
    if(cats){
        return res.status(200).send(cats);
    }else{
        throw new Error('Get Data Category Failed');
    }
});

router.get('/api/jobscat/admin/category/:catId',
checkHeaderAdmin,
async (req: Request, res: Response) => {
    const cats = req.params.catId ? await categoryDoc.findById(req.params.catId) : await categoryDoc.getAll();
    
    if(cats){
        return res.status(200).send(cats);
    }else{
        throw new Error('Get Data Category Failed');
    }
});


router.get('/api/jobscat/category/all', validateHeader, async (req: Request, res: Response) => {
    const cats = await categoryDoc.getAll();

    return res.status(200).send(cats);
});

router.get('/api/jobscat/category/:pattern',
validateHeader,
async (req: Request, res: Response) => {
    const pattern = req.params.pattern ? req.params.pattern : "";
    const cats = await categoryDoc.getCategoryByname(pattern);
    
    if(cats){
        return res.status(200).send(cats);
    }else{
        throw new Error('Get Data Category Failed');
    }
});

router.get('/api/jobscat/prefferedcategory', validateHeader, async (req: Request, res: Response) => {
    const { listCategory } = req.body;

    const users = await userDoc.getPreferredCategory(listCategory);

    if(users.length == 0){
        return res.status(404).send({ message: "Pengguna Tidak Ditemukan" });
    }

    return res.send(users);
});

export { router as getCategoryRouter };