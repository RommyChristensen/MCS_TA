import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS
import { ratingReviewCreateRouter } from './routes/create';
import { getRatingReviewRouter } from './routes/get';

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
app.use(ratingReviewCreateRouter);
app.use(getRatingReviewRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };