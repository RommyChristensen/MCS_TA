import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";

const router = express.Router();

// query params name
// q => search query

router.get('/api/searchrecommendation/worker/nearby',
validateHeader,
async (req: Request, res: Response) => {
    return res.send("test");
});

export { router as nearbyWorkerRouter }