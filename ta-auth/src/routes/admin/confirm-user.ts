import { BadRequestError, NotFoundError } from '@ta-vrilance/common';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userDoc from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';
import { UserConfirmedPublisher } from '../../events/publishers/user-confirmed-publisher';

const router = express.Router();

const checkHeader = (req: Request, res: Response, next: NextFunction) => {
    if(!req.header('admin-session-key')){
        throw new BadRequestError('Not Authorized');
    }

    try{
        jwt.verify(req.header('admin-session-key')!, process.env.JWT_KEY!);
    }catch(ex){
        throw new BadRequestError('Invalid Token');
    }

    next();
}

router.post('/api/auth/admin/users/confirm/:userId', checkHeader, async (req: Request, res: Response) => {
    const { userId } = req.params;

    if(!await userDoc.findById(userId)){
        throw new NotFoundError();
    }

    const user = await userDoc.confirmUser(userId);

    new UserConfirmedPublisher(natsWrapper.client).publish({
        id: userId
    })

    return res.status(200).send(user);
});

export { router as confirmUserRouter };