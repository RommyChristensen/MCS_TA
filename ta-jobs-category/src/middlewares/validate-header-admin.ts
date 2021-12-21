import { BadRequestError } from '@ta-vrilance/common';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const checkHeaderAdmin = (req: Request, res: Response, next: NextFunction) => {
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