import { validateHeader, validateRequest } from "@ta-vrilance/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import userDoc from "../../models/user";
import categoryDoc from "../../models/category";
import jobDoc from "../../models/job";
import { JobCreatedPublisher } from "../../events/publishers/job-created-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router();

router.post('/api/jobscat/job', 
body('title').notEmpty().withMessage('Title is Required'),
body('description').notEmpty().withMessage('Description is Required'),
body('description').isLength({ min: 100 }).withMessage('Please describe more than 100 characters'),
body('date').notEmpty().withMessage('Date is required'),
body('date').custom(val => {
    let enteredDate = new Date(val);
    let currentDate = new Date();
    if(enteredDate < currentDate) throw new Error('Please enter a valid date')
    return true;
}).withMessage('Please enter a valid date'),
body('user_id').notEmpty().withMessage('User Id is Required'),
body('user_id').custom(async val => {
    if(!val) throw new Error('User not found')
    const user = await userDoc.findById(val);
    if(user == null) throw new Error('User not found')
    return true;
}).withMessage('User not found'),
body('price').notEmpty().withMessage('Price is Required'),
body('price').isNumeric().withMessage('Price must be a valid number'),
body('category_id').notEmpty().withMessage('Category Id is Required'),
body('category_id').custom(async val => {
    if(!val) throw new Error('Category not found')
    const category = await categoryDoc.findById(val);
    if(category == null) throw new Error('Category not found')
    return true
}).withMessage('Category not found'),
validateHeader,
validateRequest,
async (req: Request, res: Response) => {
    const { title, description, date, user_id, price, category_id } = req.body;
    const dateNow = new Date();

    const category = await categoryDoc.findById(category_id);

    const c = {
        id: category.id,
        category_name: category.category_name,
        category_description: category.category_description
    }

    const job = await jobDoc.create(title, description, date, user_id, price, c, dateNow);

    // EMIT JOB CREATED EVENT
    await new JobCreatedPublisher(natsWrapper.client).publish({
        id: job.id,
        job_title: title,
        job_description: description,
        job_date: date,
        job_created_at: dateNow,
        job_created_by: user_id,
        job_category: category_id,
        job_price: price,
        job_status: job.job_status,
        _v: job._v
    });

    if(job) return res.status(201).send(job);
    return res.status(500).send({ message: "Something wrong" })
});

export { router as createJobRouter };