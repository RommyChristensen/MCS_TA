import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body, ValidationError } from 'express-validator';
import { BadRequestError, validateRequest } from '@ta-vrilance/common';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';
import adminDoc from '../models/admin';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/auth/admin/signup', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = await adminDoc.create(username, password);
    return res.send(result);
});

router.post('/api/auth/signup', [
    body('username')
        .isAlphanumeric(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Panjang Password Minimal 8 Karakter'),
    body('email')
        .isEmail()
        .withMessage('Email Tidak Valid'),
    body('password_confirmation')
        .notEmpty(),
    body('firstname').notEmpty().withMessage('Nama Depan Harus Diisi'),
    body('role').notEmpty().withMessage('Pilih Peran Anda'),
], validateRequest,  async (req: Request, res: Response) => {
    const { username, password, password_confirmation, email, firstname, lastname, role } = req.body;

    if ( !await userDoc.checkUsername(username) ){
        throw new BadRequestError("Username Telah Dipakai");
    }

    if ( !await userDoc.checkEmail(email) ){
        throw new BadRequestError("Email Telah Dipakai");
    }

    if ( password !== password_confirmation ){
        throw new BadRequestError("Password Tidak Cocok");
    }

    const hashedPassword = await Password.toHash(password);
    const result = await userDoc.create(username, hashedPassword, email, false, firstname, lastname ? lastname : '', role);
    
    const _token = jwt.sign({
        id: result.id,
        auth_username: result.auth_username,
        auth_email: result.auth_email
    }, process.env.JWT_KEY!);

    // EMIT USER CREATED EVENT
    new UserCreatedPublisher(natsWrapper.client).publish({
        id: result.id,
        auth_firstname: result.auth_firstname,
        auth_lastname: result.auth_lastname,
        auth_email: result.auth_email,
        auth_username: result.auth_username,
        auth_password: result.auth_password,
        auth_verified: result.auth_verified,
        auth_confirmed: result.auth_confirmed,
        auth_role: result.auth_role,
        _v: result._v
    })
    // END EMIT USER CREATED EVENT

    res.status(201).send({ _token });
});

export { router as signUpRouter };