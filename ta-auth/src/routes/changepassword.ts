import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';

const router = express.Router();

interface JwtPayload {
    id: string;
}

interface changePasswordResponse {
    status: string;
    message: string;
}

router.put('/api/auth/changepassword', 
validateHeader,
async (req: Request, res: Response) => {
    const { newPassword, oldPassword, confirmPassword } = req.body;

    if(oldPassword !== confirmPassword) {
        return res.status(400).send({
            message: "Password do not match!"
        })
    }

    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const response = await userDoc.changePassword(data.id, oldPassword, newPassword) as changePasswordResponse;

        if(response.status == "success"){
            return res.status(200).send(response);
        }else{
            return res.status(400).send(response);
        }
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as changePasswordRouter };