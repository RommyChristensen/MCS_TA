import { app } from './app';
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../ServiceAccountKey.json');
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderConfirmedListener } from './events/listeners/order-confirmed-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
const start = async () => {
    console.log("starting rating review service....");
    // ENV VARIABLES

    if(!process.env.JWT_KEY){
        throw new Error('JWT must be defined');
    }

    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS CLIENT ID must be defined');
    }

    if(!process.env.NATS_URL){
        throw new Error('NATS URL ID must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS CLUSTER ID must be defined');
    }

    // END ENV VARIABLES
    // -------------------
    // DB CONNECITON

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://ta-rating-review.appspot.com'
    });

    // storage = admin.storage();

    const firestore = admin.firestore();
    fireorm.initialize(firestore);

    console.log("Firebase initiation complete!");

    // END DB CONNECTION
    // -------------------
    // NATS CLIENT & LISTENERS

    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
    
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // LISTENERS
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderConfirmedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

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