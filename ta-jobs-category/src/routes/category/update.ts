import express, { Request, Response } from 'express';
import categoryDoc from '../../models/category';
import { body } from 'express-validator';
import { checkHeaderAdmin } from '../../middlewares/validate-header-admin';
import { Error } from 'mongoose';
import { validateRequest } from '@ta-vrilance/common';
import { CategoryUpdatedPublisher } from '../../events/publishers/category-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put('/api/jobscat/admin/category',
body('id').notEmpty().withMessage('Category Id Required'),
checkHeaderAdmin, 
validateRequest,
async (req: Request, res: Response) => {
    const { id, name, desc } = req.body;
    const updatedCategory = await categoryDoc.updateCategory(id, name, desc);

    // EMIT CATEGORY UPDATED EVENT
    new CategoryUpdatedPublisher(natsWrapper.client).publish({
        id: updatedCategory.id,
        category_name: updatedCategory.category_name,
        category_description: updatedCategory.category_description,
        _v: updatedCategory._v
    })

    if(updatedCategory){
        return res.status(200).send(updatedCategory);
    }else{
        throw new Error('Update Category Failed')
    }
});

export { router as updateCategoryRouter };