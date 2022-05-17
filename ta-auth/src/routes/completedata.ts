import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';
import { UserCompletedPublisher } from '../events/publishers/user-completed-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ dest: 'src/uploads/', storage: storage});

interface JwtPayload {
    id: string;
}

router.post('/api/auth/completedata', 
validateHeader,
body('bio').notEmpty(),
body('address').notEmpty(),
body('phone').isNumeric().isLength({min: 10, max: 15}).withMessage('Please Enter a Valid Phone Number'),
body('birthdate').notEmpty(),
body('gender').notEmpty(),
body('profile').notEmpty(),
validateRequest,
async (req: Request, res: Response) => {
    const { bio, address, phone, birthdate, gender } = req.body;
    let profile = req.body.profile;

    if(!profile){
        profile = 'https://firebasestorage.googleapis.com/v0/b/ta-vrilance-auth.appspot.com/o/profile_default.jpg?alt=media&token=a60e51da-2b95-4194-8f5d-9b45a8f6bd6f';
    }

    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const response = await userDoc.updateUser(data.id, {
            bio, address, phone, profile, birthdate, gender
        });

        new UserCompletedPublisher(natsWrapper.client).publish({
            id: data.id,
            auth_address: address,
            auth_bio: bio,
            auth_phone: phone,
            auth_profile: profile,
            auth_birthdate: birthdate,
            auth_gender: gender,
            _v: response._v
        })

        return res.send(response);
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as completeDataRouter };