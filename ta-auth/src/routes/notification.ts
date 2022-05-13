import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { validateHeader, BadRequestError } from '@ta-vrilance/common';
import notificationDoc from '../models/notifications';

const router = express.Router();

router.get('/api/auth/notification/:user_id', validateHeader, async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if(!user_id) throw new BadRequestError('ID Wajib Diisi');

    const notifications = await notificationDoc.findByUserId(user_id);
    return res.send(notifications);
});

router.get('/api/auth/notification/detail/:id', validateHeader, async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const notifications = await notificationDoc.findById(id);
    return res.send(notifications);
});

router.put('/api/auth/notification/read/:id', validateHeader, async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new BadRequestError('ID Wajib Diisi');

    const notifications = await notificationDoc.readNotification(id);
    return res.send(notifications);
});

export { router as notificationRouter };