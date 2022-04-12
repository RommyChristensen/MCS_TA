import { ONE_SIGNAL_CONFIG } from '../config/app.config';

export default async function SendNotification(data: any, callback: any) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic" + ONE_SIGNAL_CONFIG.API_KEY
    }

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/auth/notification",
        method: "POST",
        headers: headers
    }

    var https = require('https');
    var req = https.request(options, function(res: any) {
        res.on('data', function(data: any) {
            console.log(JSON.parse(data));

            return callback(null, JSON.parse(data));
        })

        res.on('error', function(e: any) {
            return callback({
                message: e
            })
        })
    })

    req.write(JSON.stringify(data));
    req.end();
}