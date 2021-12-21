import { validateHeader, validateRequest } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { JobDeletedPublisher } from "../../events/publishers/job-deleted-publisher";
import jobDoc from "../../models/job";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.delete('/api/jobscat/job', 
body('job_id').notEmpty().withMessage('Job Id is Required'),
body('job_id').custom(async val => {
    if (!val) throw new Error("Job Id Required");
    const job = await jobDoc.findById(val);
    if(job == null) throw new Error("Job not found");
    return true;
}).withMessage('Job not found'),
validateHeader, 
validateRequest,
async (req: Request, res: Response) => {
    const { job_id } = req.body;
    const deleteJob = await jobDoc.deleteById(job_id);

    if(deleteJob == false) throw new Error('Delete job failed');

    // EMIT JOB DELETED EVENT
    await new JobDeletedPublisher(natsWrapper.client).publish({
        id: deleteJob.id,
        _v: deleteJob._v
    });

    if(deleteJob) return res.status(200).send({ message: "Job Deleted" });
    return res.status(500).send({ message: "Something Wrong" });
});

export { router as deleteJobRouter };