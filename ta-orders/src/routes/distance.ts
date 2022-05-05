import { body } from "express-validator";
import express, { Request, Response } from "express";
import { validateHeader, validateRequest } from "@ta-vrilance/common";
import axios from 'axios';

const router = express.Router();

router.post('/api/orders/distance',
validateHeader, 
body('origins').notEmpty().withMessage('Origin Required'),
body('destinations').notEmpty().withMessage('Destination Required'),
validateRequest, 
async (req: Request, res: Response) => {
    const key = process.env.G_MAPS_API_KEY!;
    const { origins, destinations } = req.body;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:${destinations}&origins=place_id:${origins}&key=${key}`;
    const data = await axios.get(url);

    if(data){
        return res.send(data.data);
    }else{
        return res.status(500).send({ message: "Ada Yang Salah" })
    }
});

export { router as getDistancePlacesRouter }