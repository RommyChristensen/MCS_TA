import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders/admin/get/:orderId', async (req: Request, res: Response) => {
    //TODO: GET ORDERS ADMIN
    return res.send(true);
});

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    //TODO: GET ORDERS USERS
    return res.send(true);
});

export { router as getRouter };