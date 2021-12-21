import { BadRequestError } from '@ta-vrilance/common';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userDoc from '../../models/user';

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

router.get('/api/auth/admin/users', checkHeader, async (req: Request, res: Response) => {
    const users = await userDoc.getAll();
    return res.status(200).send(users);
});

export { router as getUserRouter };