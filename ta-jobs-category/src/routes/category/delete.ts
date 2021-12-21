import express, { Request, Response } from 'express';
import categoryDoc from '../../models/category';
import { checkHeaderAdmin } from '../../middlewares/validate-header-admin';
import { Error } from 'mongoose';
import { body } from 'express-validator';
import { validateRequest } from '@ta-vrilance/common';
import { CategoryUpdatedPublisher } from '../../events/publishers/category-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';
import { CategoryDeletedPublisher } from '../../events/publishers/category-deleted-publisher';

const router = express.Router();

router.delete('/api/jobscat/admin/category',
body('category_id').notEmpty().withMessage('Category Id Required'),
checkHeaderAdmin,
validateRequest,
async (req: Request, res: Response) => {
    const { category_id } = req.body;
    const category = await categoryDoc.deleteById(category_id);

    // CATEGORY DELETED EVENT
    new CategoryDeletedPublisher(natsWrapper.client).publish({
        id: category_id
    });

    if(category){
        res.status(200).send({ msg: "Category Deleted" })
    }else{
        throw new Error('Delete Failed');
    }
});

export { router as deleteCategoryRouter };