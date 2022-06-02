import { validateHeader, validateRequest } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { JobDeletedPublisher } from "../../events/publishers/job-deleted-publisher";
import categoryDoc from "../../models/category";
import jobDoc from "../../models/job";
import userDoc from "../../models/user";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.get('/api/jobscat/admin/reportjob', 
body('month').notEmpty().withMessage('Month is Required'),
validateHeader, 
validateRequest,
async (req: Request, res: Response) => {
    const { month } = req.body;
    const jobByMonth = await jobDoc.getByMonth(month);

    return res.send(jobByMonth);
});

router.get('/api/jobcat/admin/reportcategory', async (req: Request, res: Response) => {
    const cat = await categoryDoc.getAll();

    await Promise.all(cat.map(async (c) => {
        let user = await userDoc.getPreferredCategory([c.id]);

        return {
            category_id: c.id,
            category_name: c.category_name,
            number: user.length,
        };
    })).then(result => {
        return res.status(200).send(result);
    })
});

export { router as reportJobRouter };