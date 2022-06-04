import express, { Request, Response } from "express";
import { validateHeader } from "@ta-vrilance/common";

const router = express.Router();

router.get('/api/ratingreview/admin/reportuser',
validateHeader, 
async (req: Request, res: Response) => {
});

export { router as reportRatingRouter }