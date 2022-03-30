import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";
import userDoc from "../models/user";

const router = express.Router();

router.get('/api/payments/:user_id', 
validateHeader,
async (req: Request, res: Response) => {
    const user = await userDoc.findById(req.params.user_id);
    return res.send(user);
});

export { router as getRouter }