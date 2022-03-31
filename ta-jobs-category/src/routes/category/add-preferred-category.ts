import { validateHeader, validateRequest } from '@ta-vrilance/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import userDoc from '../../models/user';

const router = express.Router();

router.post('/api/jobscat/addpreferredcategory',
body('user_id').notEmpty().withMessage('Please enter user id'),
body('category_id').notEmpty().withMessage('Please enter category id'),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { user_id, category_id } = req.body;

    const user = await userDoc.addPreferredCategory(user_id, category_id);

    return res.send(user);
});

export { router as addPreferredCategoryRouter };