import { app } from './app';
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../ServiceAccountKey.json');
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { JobCreatedListener } from './events/listeners/job-created-listener';
import { CategoryCreatedListener } from './events/listeners/category-created-listener';
import { UserVerifiedListener } from './events/listeners/user-verified-listener';
import { UserConfirmedListener } from './events/listeners/user-confirmed-listener';
import { OrderExpiredListener } from './events/listeners/order-expired-listener';
import { CategoryUpdatedListener } from './events/listeners/category-updated-listener';
import { CategoryDeletedListener } from './events/listeners/category-deleted-listener';
import { RatingReviewCreatedListener } from './events/listeners/rating-review-created-listener';
import { OrderAutoConfirmedListener } from './events/listeners/order-auto-confirm-listener';
import { UserCompletedListener } from './events/listeners/user-completed-listener';
const start = async () => {
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
        storageBucket: 'gs://ta-orders.appspot.com'
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

        new UserCreatedListener(natsWrapper.client).listen();
        new UserVerifiedListener(natsWrapper.client).listen();
        new UserConfirmedListener(natsWrapper.client).listen();
        new UserCompletedListener(natsWrapper.client).listen();
        new JobCreatedListener(natsWrapper.client).listen();
        new CategoryCreatedListener(natsWrapper.client).listen();
        new CategoryUpdatedListener(natsWrapper.client).listen();
        new CategoryDeletedListener(natsWrapper.client).listen();
        new OrderExpiredListener(natsWrapper.client).listen();
        new RatingReviewCreatedListener(natsWrapper.client).listen();
        new OrderAutoConfirmedListener(natsWrapper.client).listen();

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