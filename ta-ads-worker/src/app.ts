import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS

import { createAdsRouter } from './routes/create';
import { getAdsRouter } from './routes/get';
import { updateAdsRouter } from './routes/update';
import { confirmAdsRouter } from './routes/confirm';

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

app.use(createAdsRouter);
app.use(getAdsRouter);
app.use(updateAdsRouter);
app.use(confirmAdsRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };