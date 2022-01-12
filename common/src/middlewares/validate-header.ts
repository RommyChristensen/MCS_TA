import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "..";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname+'/.env' });

export const validateHeader = (req: Request, res: Response, next: NextFunction) => {
    if(!req.header('x-auth-token')){
        throw new BadRequestError("Auth Token Required!")
    }

    try{
        jwt.verify(req.header('x-auth-token')!, 'christensen');
    }catch(ex){
        throw new BadRequestError("Auth Token Not Valid!");
    }

    next();
}