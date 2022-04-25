import { BadRequestError, validateHeader, validateRequest } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { JobUpdatedPublisher } from "../../events/publishers/job-updated-publisher";
import { JobStatusUpdatedPublisher } from "../../events/publishers/job-status-updated-publisher";
import jobDoc, { JobStatus } from "../../models/job";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

const numbers = "1234567890";

const checkNumber = (text: string) => {
    for(let i = 0; i < text.length; i++){
        if(!numbers.includes(text[i])){
            return false;
        }
    }

    return true;
}

router.put('/api/jobscat/job/:job_id',
validateHeader, 
async (req: Request, res: Response) => {
    if(req.body.price && !checkNumber(req.body.price)) {
        throw new BadRequestError("Please enter a valid price");
    }
    
    if(req.body.date){
        let enteredDate = new Date(req.body.date);
        let currentDate = new Date();
        console.log(typeof enteredDate);
        console.log(enteredDate.toString());
        if(enteredDate.toString() == "Invalid Date") throw new BadRequestError('Please enter a valid date');
        if(enteredDate < currentDate) throw new BadRequestError('Date must greater than current date');
    }

    if(req.body.description && req.body.description.length < 100){
        throw new BadRequestError("Please describe more than 100 characters");
    }

    if(!await jobDoc.findById(req.params.job_id)){
        throw new BadRequestError("Job not found");
    }

    // yang bisa diupdate = title, description, date, price
    const title = req.body.title || null;
    const description = req.body.description || null;
    const price = req.body.price || null;
    const date = req.body.date || null;

    const updatedJob = await jobDoc.updateJob(req.params.job_id, title, description, price, date);

    // EMIT JOB UPDATED EVENT
    await new JobUpdatedPublisher(natsWrapper.client).publish({
        id: updatedJob.id,
        job_title: updatedJob.job_title,
        job_description: updatedJob.job_description,
        job_date: updatedJob.job_date,
        job_price: updatedJob.job_price,
        _v: updatedJob._v
    });

    return res.send(updatedJob);
});

const validateJobStatus = (jobStatus: string) => {
    if(jobStatus == JobStatus.aktif || jobStatus == JobStatus.nonaktif || jobStatus == JobStatus.selesai){
        return true;
    }

    return false;
}

router.put('/api/jobscat/job/status/:job_id', 
body('job_status').notEmpty().withMessage('Status Job Wajib Diisikan'),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { job_id } = req.params;
    const { job_status } = req.body;

    if(job_id) {
        if(validateJobStatus(job_status)){
            const job = await jobDoc.updateStatusJob(job_id, job_status);

            // publish event for job updated status
            await new JobStatusUpdatedPublisher(natsWrapper.client).publish({
                id: job.id,
                job_status: job.job_status,
                _v: job._v
            })

            return res.send(job);
        }

        return res.status(400).send({ message: "Status Job Tidak Dikenali" });
    }else{
        return res.status(400).send({ message: "Id Job Diperlukan" });
    }
});

export { router as updateJobRouter };