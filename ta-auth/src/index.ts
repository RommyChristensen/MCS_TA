import { app } from './app';
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../ServiceAccountKey.json');
import { natsWrapper } from './nats-wrapper';
import { MessageNotificationListener } from './events/listeners/message-notification-listener';
// let storage = null;

const start = async () => {
    // ENV VARIABLES
    console.log("starting up ta auth, modified for new cluster 3");

    if(!process.env.JWT_KEY){
        throw new Error('JWT must be defined');
    }

    if(!process.env.G_CLIENT_ID){
        throw new Error('CLIENT ID must be defined');
    }

    if(!process.env.G_CLIENT_SECRET){
        throw new Error('CLIENT SECRET must be defined');
    }

    if(!process.env.G_REDIRECT_URI){
        throw new Error('REDIRECT URI must be defined');
    }

    if(!process.env.G_REFRESH_TOKEN){
        throw new Error('REFRESH TOKEN must be defined');
    }

    if(!process.env.G_ACCESS_TOKEN){
        throw new Error('ACCESS TOKEN must be defined');
    }

    // END ENV VARIABLES
    // -------------------
    // DB CONNECITON

    try{
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: 'gs://ta-vrilance-auth.appspot.com'
        });
    
        const firestore = admin.firestore();
        fireorm.initialize(firestore);
    
        console.log("Firebase initiation complete!");
    }catch(err){
        console.log(err);
    }

    // END DB CONNECTION
    // -------------------
    // NATS CLIENT & LISTENERS

    try{
        await natsWrapper.connect('vrilance', 'abcdef', 'http://ta-nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
    
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // LISTENER
        new MessageNotificationListener(natsWrapper.client).listen();
    }catch(err){
        console.log(err);
    }

    // END NATS CLIENT
    // -------------------
    // LISTEN TO PORT
    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
}

start();
// export default storage;