import { Request, Response, NextFunction } from 'express';
import { ONE_SIGNAL_CONFIG } from '../config/app.config';
import pushNotificationService from '../services/push-notification-service';

exports.SendNotification = (req, res, next) => {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        contents: { on: "Test Push Notification" },
        include_segments: ["All"],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Custom Notification"
        }
    }

    pushNotificationService.SendNotification(message, (error, results) => {
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: results,
        })
    })
}

exports.SendNotificationToDevice = async (req, res, next) => {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        contents: { on: "Test Push Notification" },
        include_segments: ["included_player_ids"],
        include_player_ids: req.body.devices,
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Custom Notification"
        }
    }

    pushNotificationService.SendNotification(message, (error, results) => {
        if(error){
            return next(error);
        }

        return res.status(200).send({
            message: "Success",
            data: results,
        })
    })
}