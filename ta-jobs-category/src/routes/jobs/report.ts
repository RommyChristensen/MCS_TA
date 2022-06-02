import { validateHeader, validateRequest } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { JobDeletedPublisher } from "../../events/publishers/job-deleted-publisher";
import jobDoc from "../../models/job";
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

export { router as reportJobRouter };