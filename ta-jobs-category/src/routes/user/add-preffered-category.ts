import express, { Request, Response } from "express";
import categoryDoc from "../../models/category";

const router = express.Router();

router.post('/api/jobscat/addprefferedcategory/:idCat', async (req: Request, res: Response) => {
    const { idCat } = req.params;

    const cat = await categoryDoc.findById(idCat);

    return res.send(cat);
});

export { router as addPreferredCategoryRouter }