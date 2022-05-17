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

const rToken = "1//04Y8lTWD77QP9CgYIARAAGAQSNwF-L9Ir_zz16LwTmATaVF8MRgmMiEcGj2pFTAcrojrd61ymAYNmhzih7OGRDEJlAY4ns_nf7Po";
const aToken = "ya29.A0ARrdaM8Z3FLNutnrvCAtl5qI_QCzfDb7c2Q_Kq2Ei4nopn7TIthncgQqnZoBRRcxrkbs4Oi8Peh5mQhL51q-lQqIhKtqDj0tebepS7VW_L0AUip8gtK_Rdjma2ZUU4szVuM1Ldn_TxZln6kJeJXCDlw1TKJp";
const userMail = "ta.vrilance3@gmail.com";

router.post('/api/auth/sendverification', 
validateHeader,
async (req: Request, res: Response) => {
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const email = data.auth_email;
        const firstname = data.auth_username;
        const token = generateToken();

        const oAuth2Client = new google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, process.env.G_REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: rToken});


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                user: userMail,
                clientId: process.env.G_CLIENT_ID,
                clientSecret: process.env.G_CLIENT_SECRET,
                refreshToken: rToken, // TODO: ganti ke proccess.env.G_REFRESH_TOKEN
                accessToken: aToken,
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