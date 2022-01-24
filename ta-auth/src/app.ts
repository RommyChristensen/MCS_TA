import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS

import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { completeDataRouter } from './routes/completedata';
import { getUserRouter } from './routes/admin/get-user';
import { verifyEmailRouter } from './routes/sendmail';
import { confirmUserRouter } from './routes/admin/confirm-user';
import { changeProfilePictureRouter } from './routes/changeprofilepicture';
import { changeProfileRouter } from './routes/changeprofile';
import { changePasswordRouter } from './routes/changepassword';
import { getUserRouter } from './routes/admin/get-user';

// END IMPORT ROUTERS

const app = express();

app.set('trust proxy', true);

app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
);

// USE ROUTERS

app.use(signInRouter);
app.use(signUpRouter);
app.use(completeDataRouter);
app.use(getUserRouter);
app.use(verifyEmailRouter);
app.use(confirmUserRouter);
app.use(changeProfilePictureRouter);
app.use(changeProfileRouter);
app.use(changePasswordRouter);
app.use(getUserRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };