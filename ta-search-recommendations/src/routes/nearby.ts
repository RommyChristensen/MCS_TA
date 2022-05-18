import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import { natsWrapper } from "../nats-wrapper";
import userDoc from "../models/user";
import jobDoc from "../models/job";
import axios from "axios";

const router = express.Router();

// query params name
// q => search query

// https://maps.googleapis.com/maps/api/distancematrix/json?destinations=<destinations>&origins=<origins>&key=AIzaSyBeH-O8Lx3Cw2gSc5iZD5KKpE3BuvMxHtI
const key = 'AIzaSyBeH-O8Lx3Cw2gSc5iZD5KKpE3BuvMxHtI';

router.get('/api/searchrecommendation/worker/nearby/:originId',
validateHeader,
async (req: Request, res: Response) => {
    let origins = "";
    let destinations = "";
    
    const { originId } = req.params;

    origins = "place_id:" + originId;

    const users = await userDoc.getAll();
    const completed = users.filter(u => {
        return u.auth_confirmed == true && u.auth_role == "worker"
    });
    const addresses = completed.map(u => {
        return u.auth_address;
    });

    addresses.forEach((a, i) => {
        destinations += "place_id:" + a + (i != addresses.length - 1 ? "|" : "");
    });

    let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;

    console.log(url);

    let response = await axios.get(url);

    const resMap = response.data.rows[0].elements.map((e: any, i: number) => {
        let d = e;
        d["user_id"] = completed[i].id;
        d["user_username"] = completed[i].auth_username;
        d["place_id"] = addresses[i];
        return d;
    });

    return res.send({elements: response.data.rows[0].elements, resMap});
});

export { router as nearbyWorkerRouter }