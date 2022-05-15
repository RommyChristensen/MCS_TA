import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mustache from 'mustache';
import verificationDoc from '../models/verification';
import userDoc from '../models/user';
import { validateHeader, BadRequestError } from '@ta-vrilance/common';
import { google } from 'googleapis';
import { template } from '../services/mail-template';
import { UserVerifiedPublisher } from '../events/publishers/user-verified-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

interface JwtPayload {
    id: string;
    auth_email: string;
    auth_username: string;
}

const generateToken = () => {
    let output = '';
    for(let i = 0; i < 6; i++){
        output += Math.floor(Math.random() * 10) + '';
    }
    return output;
}

router.post('/api/auth/sendverification', 
validateHeader,
async (req: Request, res: Response) => {
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const email = data.auth_email;
        const firstname = data.auth_username;
        const token = generateToken();

        const oAuth2Client = new google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, process.env.G_REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: "1//04VYwvkw6HOKVCgYIARAAGAQSNwF-L9IrmVed8d6nbAM3F5AvEFgxVDfUGCX1XBo51Bes2fFzfLCs66OhnUrW_k9mpGnv3hAGYXQ"});
        
        console.log("abc");
        
        // const accessToken = await oAuth2Client.getAccessToken();

        console.log("ya29.A0ARrdaM-jWayqajQBQMB-bC0ZyQZBkAzA01Y1r3sU2xxTBx_ZVtEfMgkPJk5gZgOkvl0OyTkDOsATzi_cLAAe4ZqcytSGQruLR9NSJ3P3-zMIAu9Vrp8BFJMMYUNuNDEqu_IN1ucFRaCWWCirbeO7Gbcv5rKR");
        console.log(oAuth2Client);

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: 'rommycy00@gmail.com',
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: "1//04VYwvkw6HOKVCgYIARAAGAQSNwF-L9IrmVed8d6nbAM3F5AvEFgxVDfUGCX1XBo51Bes2fFzfLCs66OhnUrW_k9mpGnv3hAGYXQ", // TODO: ganti ke proccess.env.G_REFRESH_TOKEN
                accessToken: "ya29.A0ARrdaM9-BUreavD5PZFijUffkbfr-pIB5eOP7Pmq4h9vp5_UHVssOGLMOJz_z5M8B-_zSswCGgFyLt8_m0AAdD3DoBGKydIpOgcpFmAQDrIpvP9PsxnCQcHHKaHQXS__8bF7vkkODNaEV8PbFIskvE92h8yA",
            }
        } as SMTPTransport.Options);

        var mailOptions = {
            to: email,
            from: "Vrilance",
            subject: 'Vrilance - Email Activation',
            html: mustache.render(template, {firstname, token})
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).send({ msg: "Send Mail Failed" });
            } else {

                // insert to db - set verification code
                
                const userId = data.id;
                await verificationDoc.create(token, userId);

                // end insert db

                return res.send({ msg: "Verification Token Sent!"});
            }
        });
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

router.post('/api/auth/verify/:token', validateHeader, async (req: Request, res: Response) => {
    let data = null;
    try{
        data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }

    const user = await userDoc.findById(data.id);
    if(user.auth_verified){
        return res.status(200).send({ msg: "User Already Verified" });
    }

    const { token } = req.params;
    const verification = await verificationDoc.findByUserIdValid(data.id);

    if(verification.verification_token === token){
        // update user verified

        const updatedUser = await userDoc.verifyUser(data.id);

        // EMIT VERIFIED USER EVENT

        new UserVerifiedPublisher(natsWrapper.client).publish({
            id: updatedUser.id
        });

        // END EMIT VERIFIED USER EVENT

        return res.status(200).send(updatedUser);

        // end update user verified
    }else{
        throw new BadRequestError('Token Invalid!');
    }
});

export { router as verifyEmailRouter };