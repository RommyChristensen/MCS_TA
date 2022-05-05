import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS

import { createOrderRouter } from './routes/create';
import { updateOrderRouter } from './routes/update';
import { acceptOrderRouter } from './routes/accept';
import { rejectOrderRouter } from './routes/reject';
import { orderCancelledRouter } from './routes/cancel';
import { orderDoneRouter } from './routes/done';
import { orderConfirmedRouter } from './routes/confirmed';
import { orderGetRouter } from './routes/get';
import { orderOnLocationRouter } from './routes/onlocation';
import { getDistancePlacesRouter } from './routes/distance';

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

app.use(createOrderRouter);
app.use(updateOrderRouter);
app.use(acceptOrderRouter);
app.use(rejectOrderRouter);
app.use(orderCancelledRouter);
app.use(orderDoneRouter);
app.use(orderConfirmedRouter);
app.use(orderGetRouter);
app.use(orderOnLocationRouter);
app.use(getDistancePlacesRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };