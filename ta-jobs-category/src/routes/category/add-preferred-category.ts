import { validateHeader, validateRequest } from '@ta-vrilance/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import categoryDoc from '../../models/category';
import userDoc from '../../models/user';

const router = express.Router();

router.post('/api/jobscat/addpreferredcategory',
body('user_id').notEmpty().withMessage('Please enter user id'),
body('category_id').notEmpty().withMessage('Please enter category id'),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { user_id, category_id } = req.body;

    const c = await categoryDoc.findById(category_id);
    const u = await userDoc.findById(user_id);

    if(!u) return res.send(404).send({ msg: "User Tidak Ditemukan" });

    if(!c) return res.status(404).send({ msg: "Kategori Tidak Ditemukan" });

    const user = await userDoc.addPreferredCategory(user_id, category_id);

    return res.send({ user, cat: c });
});

router.get('/api/jobscat/getpreferredcategory', 
body('user_id').notEmpty().withMessage('Please enter user id'),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {

    const { user_id } = req.body;

    const u = await userDoc.findById(user_id);
    const c = await categoryDoc.findById(u.preferred_category);

    return res.send({ cat: c });
});

export { router as addPreferredCategoryRouter };