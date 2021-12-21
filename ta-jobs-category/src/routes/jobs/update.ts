import { BadRequestError, validateHeader, validateRequest } from "@ta-vrilance/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jobDoc from "../../models/job";

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

    return res.send(updatedJob);
});

export { router as updateJobRouter };