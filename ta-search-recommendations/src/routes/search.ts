import { body } from "express-validator";
import express, { Request, Response } from "express";
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

export { router as searchByNameRouter }