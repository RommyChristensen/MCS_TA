import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";

const router = express.Router();

// query params name
// q => search query

// https://maps.googleapis.com/maps/api/distancematrix/json?destinations=<destinations>&origins=<origins>&key=AIzaSyBeH-O8Lx3Cw2gSc5iZD5KKpE3BuvMxHtI
const key = 'AIzaSyBeH-O8Lx3Cw2gSc5iZD5KKpE3BuvMxHtI';
let origins = "";
let destinations = "";
let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${key}`;

router.get('/api/searchrecommendation/worker/nearby',
validateHeader,
async (req: Request, res: Response) => {
    const { originId } = req.body;

    origins = originId;

    return res.send("test");
});

export { router as nearbyWorkerRouter }