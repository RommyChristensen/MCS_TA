import { validateHeader } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { checkHeaderAdmin } from "../../middlewares/validate-header-admin";
import categoryDoc from "../../models/category";
import jobDoc from "../../models/job";
import userDoc from "../../models/user";

const router = express.Router();

router.get('/api/jobscat/admin/job', checkHeaderAdmin, async (req: Request, res: Response) => {
    let jobs = await jobDoc.getAll();

    await Promise.all(jobs.map(async (job) => {
        let category = await categoryDoc.findById(String(job.job_category));
        let user = await userDoc.findById(String(job.job_created_by));

        job['job_category'] = category;
        job['job_created_by'] = user;

        return job;
    })).then(result => {
        return res.status(200).send(result);
    })

    // return res.status(200).send(returnedJobs);
});

router.get('/api/jobscat/job', validateHeader, async (req: Request, res: Response) => {
    const jobs = await jobDoc.getAll();

    return res.status(200).send(jobs);
});

export { router as getJobRouter };