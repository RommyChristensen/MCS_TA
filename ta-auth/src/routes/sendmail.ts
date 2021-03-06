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

export const rToken = "1//044ACNnXa5pDTCgYIARAAGAQSNwF-L9Ir-ZMrL-L76A43fIEzHVnAS5CtUoQ7N17_LBIPCfnKSDZnXlA3ydDll8VPiLnzK11c-eo";
export const aToken = "ya29.a0ARrdaM-O9Z96WX87FmgHRPdlr1S0vs_t0ERvL7Urey8J_kS3OI3_5ngCw6fwyxbV2aHwKe-MtqMQgN4Vy3ZP2Ggv_SlQKPduf5xKQax5_bVoiQQSKTVWiXCwVFOigl4DYGCQ7oCSgn6gmiF1OKqaldlmiT3r";
export const userMail = "ta.vrilance3@gmail.com";


router.post('/api/auth/sendverification', 
validateHeader,
async (req: Request, res: Response) => {
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const email = data.auth_email;
        const firstname = data.auth_username;
        const token = generateToken();

        const oAuth2Client = new google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, process.env.G_REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: process.env.G_REFRESH_TOKEN});


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: userMail,
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: process.env.G_REFRESH_TOKEN, // TODO: ganti ke proccess.env.G_REFRESH_TOKEN
                accessToken: process.env.G_ACCESS_TOKEN,
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
                const userId = data.id;
                await verificationDoc.create(token, userId);
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
        const updatedUser = await userDoc.verifyUser(data.id);
        new UserVerifiedPublisher(natsWrapper.client).publish({
            id: updatedUser.id
        });
        return res.status(200).send(updatedUser);
    }else{
        throw new BadRequestError('Token Invalid!');
    }
});

export { router as verifyEmailRouter };