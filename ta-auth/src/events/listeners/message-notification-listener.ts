import { Message } from 'node-nats-streaming';
import { Subjects, Listener, MessageNotificationEvent } from '@ta-vrilance/common';
import { queueGroupName } from './queue-group-name';
import notificationDoc from '../../models/notifications';
import userDoc from '../../models/user';
import { google } from 'googleapis';
import { template } from '../../services/notif-mail-template';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import mustache from 'mustache';
import { rToken } from '../../routes/sendmail';
import { aToken } from '../../routes/sendmail';
import { userMail } from '../../routes/sendmail';

export class MessageNotificationListener extends Listener<MessageNotificationEvent> {
    subject: Subjects.MessageNotification = Subjects.MessageNotification;
    queueGroupName = queueGroupName;

    async onMessage(data: MessageNotificationEvent['data'], msg: Message){
        const { topic, message, user_id } = data;

        // Store new user to database
        const user = await userDoc.findById(user_id);
        await notificationDoc.create(user_id, topic, message, user.auth_profile);

        try{
            const title = topic;
            const subtitle = new Date(new Date().toLocaleString('en-US', { timeZone: "Asia/Jakarta"})).toDateString();
            const message = message;
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
                subject: 'Vrilance - Notifikasi Pesanan',
                html: mustache.render(template, {title, subtitle, message})
            };
    
            transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Notifikasi Dikirim");
                }
            });
        }catch(ex){
            console.log(ex);
        }

        msg.ack();
    }
}