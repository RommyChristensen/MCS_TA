import express from 'express';
import userDoc from '../models/user';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '@ta-vrilance/common';
import { Password } from '../services/password';
import adminDoc from '../models/admin';

const router = express.Router();

router.post('/api/auth/admin/signin', async (req, res) => {
    const { username, password } = req.body;
    const admin = await adminDoc.findByUsername(username);
    if(admin){
        if(!await Password.compare(admin.admin_password, password)){
            throw new BadRequestError('Wrong Password');
        }

        const data = jwt.sign({
            _v: admin._v,
            admin_username: admin.admin_username,
            id: admin.id
        }, process.env.JWT_KEY!, { expiresIn: '3d' });

        return res.send({ 'x-admin-key' : data });
    }else{
        throw new BadRequestError('Data Admin Not Found');
    }
})

router.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;

    if(await userDoc.checkEmail(email)){
        throw new BadRequestError('Email Tidak Terdaftar');
    }

    const user = await userDoc.findByEmail(email);

    if(!await Password.compare(user[0].auth_password, password)) {
        throw new BadRequestError('Password Salah')
    }

    const data = jwt.sign({
        _v: user[0]._v,
        auth_email: user[0].auth_email,
        auth_username: user[0].auth_username,
        id: user[0].id,
        auth_role: user[0].auth_role,
        auth_firstname: user[0].auth_firstname,
        auth_lastname: user[0].auth_lastname,
        auth_bio: user[0].auth_bio,
        auth_profile: user[0].auth_profile,
        auth_phone: user[0].auth_phone,
        auth_verified: user[0].auth_verified,
        auth_confirmed: user[0].auth_confirmed,
        auth_completed: user[0].auth_completed,
        auth_address: user[0].auth_address,
        auth_birthdate: user[0].auth_birthdate,
        auth_gender: user[0].auth_gender
    }, process.env.JWT_KEY!, { expiresIn: '3d' });

    return res.send({ 'x-auth-token' : data });
});

export { router as signInRouter };