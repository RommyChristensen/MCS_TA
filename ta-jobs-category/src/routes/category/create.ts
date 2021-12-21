import express, { Request, Response } from 'express';
import categoryDoc from '../../models/category';
import { body } from 'express-validator';
import { checkHeaderAdmin } from '../../middlewares/validate-header-admin';
import { Error } from 'mongoose';
import { validateRequest } from '@ta-vrilance/common';
import { CategoryCreatedPublisher } from '../../events/publishers/category-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post('/api/jobscat/admin/category',
body('name').notEmpty().withMessage("Category Name Required"),
body('desc').notEmpty().withMessage('Category Description Required'),
checkHeaderAdmin,
validateRequest,
async (req: Request, res: Response) => {
    const { name, desc } = req.body;
    const newCat = await categoryDoc.create(name, desc);

    // EMIT CATEGORY CREATED EVENT
    new CategoryCreatedPublisher(natsWrapper.client).publish({
        id: newCat.id,
        category_name: name,
        category_description: desc,
        _v: newCat._v
    })
    
    if(newCat){
        return res.status(201).send(newCat);
    }else{
        throw new Error('Create Category Failed');
    }
});

export { router as createCategoryRouter };