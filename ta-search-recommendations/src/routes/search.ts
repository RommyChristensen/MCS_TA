import { body } from "express-validator";
import express, { json, Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";

const router = express.Router();

// query params name
// q => search query

router.get('/api/searchrecommendation/worker/name',
validateHeader,
async (req: Request, res: Response) => {
    const { q } = req.query;

    const filteredUser = await userDoc.searchWorkerByName(q as string);

    return res.send(filteredUser);
});

router.get('/api/searchrecommendation/jobs/name',
validateHeader,
async (req: Request, res: Response) => {
    const { q } = req.query;

    const jobs = await jobDoc.getAll();

    const filteredJobs = jobs.filter(j => {
        return j.job_title.includes(q as string);
    });

    return res.send(filteredJobs);
});

router.post('/api/searchrecommendation/jobs/category',
validateHeader,
async (req: Request, res: Response) => {
    const { listCategory } = req.body;

    const jobs = await jobDoc.getJobByCategory(listCategory);

    if(jobs.length == 0){
        return res.status(404).send({ message: "Pekerjaan Tidak Ditemukan" });
    }

    const newJobs = jobs.map(async j => {
        const u = await userDoc.findById(j.job_created_by as string);

        j.job_created_by = u.auth_firstname + " " + u.auth_lastname;
        return j;
    });

    return res.send(newJobs);
});

export { router as searchByNameRouter }