import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';
import { UserChangeProfilePublisher } from '../events/publishers/user-change-profile-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

interface JwtPayload {
    id: string;
}

router.put('/api/auth/changeprofile', 
validateHeader,
async (req: Request, res: Response) => {
    const { firstname, lastname, bio, address, phone } = req.body;
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const response = await userDoc.changeProfile(data.id, {
            firstname, lastname, bio, address, phone
        })

        new UserChangeProfilePublisher(natsWrapper.client).publish({
            id: response.id,
            firstname, lastname, bio, address, phone
        })

        return res.send(response);
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as changeProfileRouter };