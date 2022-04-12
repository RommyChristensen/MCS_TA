const pushNotificationController = require('../controllers/push-notification.controllers');

import express from 'express';

const router = express.Router();

router.get('/api/auth/sendnotification', pushNotificationController.SendNotification);
router.post('/api/auth/sendnotificationdevice', pushNotificationController.SendNotificationToDevice);

export {
    router as sendNotifRouter
}