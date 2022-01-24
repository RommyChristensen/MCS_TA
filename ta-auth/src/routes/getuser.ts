import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

interface JwtPayload {
    id: string;
}

router.get('/api/auth/getUserById', 
validateHeader,
async (req: Request, res: Response) => {
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const user = await userDoc.findById(data.id);

        return res.send(user);
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as getUserRouter };