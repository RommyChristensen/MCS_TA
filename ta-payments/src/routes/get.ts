import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";

const router = express.Router();

router.get('/api/payments/:user_id', 
validateHeader,
async (req: Request, res: Response) => {

});

export { router as getRouter }