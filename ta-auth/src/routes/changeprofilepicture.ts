import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';
import { UserUpdatePPPublisher } from '../events/publishers/user-change-pp-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ dest: 'src/uploads/', storage: storage});

interface JwtPayload {
    id: string;
}

router.put('/api/auth/changepp', 
validateHeader,
body('profile').notEmpty(),
validateRequest,
async (req: Request, res: Response) => {
    const { profile } = req.body;
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const response = await userDoc.changepp(data.id, profile);

        new UserUpdatePPPublisher(natsWrapper.client).publish({
            id: response.id,
            profile: response.auth_profile
        });

        return res.send(response);
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as changeProfilePictureRouter };