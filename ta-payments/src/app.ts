import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS

import { topUpRouter } from './routes/top-up';
import { updatePaymentsRouter } from './routes/update-payments';
import { getRouter } from './routes/get';
import { payRouter } from './routes/pay';
import { completePaymentDataRouter } from './routes/complete';
import { withdrawRouter } from './routes/withdraw';
import { reportUserRouter } from './routes/report';

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

app.use(topUpRouter);
app.use(updatePaymentsRouter);
app.use(getRouter);
app.use(payRouter);
app.use(completePaymentDataRouter);
app.use(withdrawRouter);
app.use(reportUserRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };