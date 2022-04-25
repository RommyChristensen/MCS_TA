import { app } from './app';
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../ServiceAccountKey.json');
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserConfirmedListener } from './events/listeners/user-confirmed-listener';
import { UserVerifiedListener } from './events/listeners/user-verified-listener';
import { UserUpdatePPListener } from './events/listeners/user-change-pp-listener';
import { UserCompletedListener } from './events/listeners/user-completed-listener';
import { JobCreatedListener } from './events/listeners/job-created-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderConfirmedListener } from './events/listeners/order-confirmed-listener';
import { JobStatusUpdatedListener } from './events/listeners/job-status-updated-listener';
import { JobUpdatedListener } from './events/listeners/job-updated-listener';
import { JobDeletedListener } from './events/listeners/job-deleted-listener';
const start = async () => {
    console.log("starting search recommendations service....");
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
        storageBucket: 'gs://ta-search-recommendations.appspot.com'
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
        new UserConfirmedListener(natsWrapper.client).listen();
        new UserCompletedListener(natsWrapper.client).listen();
        new UserVerifiedListener(natsWrapper.client).listen();
        new UserUpdatePPListener(natsWrapper.client).listen();
        new UserCompletedListener(natsWrapper.client).listen();
        new JobCreatedListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderConfirmedListener(natsWrapper.client).listen();
        new JobStatusUpdatedListener(natsWrapper.client).listen();
        new JobUpdatedListener(natsWrapper.client).listen();
        new JobDeletedListener(natsWrapper.client).listen();

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