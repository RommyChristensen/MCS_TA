import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@ta-vrilance/common';

// IMPORT ROUTERS

import { createJobRouter } from './routes/jobs/create';
import { getJobRouter } from './routes/jobs/get';
import { updateJobRouter } from './routes/jobs/update';
import { deleteJobRouter } from './routes/jobs/delete';

import { getCategoryRouter } from './routes/category/get';
import { createCategoryRouter } from './routes/category/create';
import { updateCategoryRouter } from './routes/category/update';
import { deleteCategoryRouter } from './routes/category/delete';

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

app.use(createJobRouter);
app.use(getJobRouter);
app.use(updateJobRouter);
app.use(deleteJobRouter);

app.use(getCategoryRouter);
app.use(createCategoryRouter);
app.use(updateCategoryRouter);
app.use(deleteCategoryRouter);

// END USE ROUTERS

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };