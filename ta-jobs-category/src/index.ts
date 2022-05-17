import { app } from './app';
import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../ServiceAccountKey.json');
import { natsWrapper } from './nats-wrapper';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { UserVerifiedListener } from './events/listeners/user-verified-listener';
import { UserConfirmedListener } from './events/listeners/user-confirmed-listener';
import { UserCompletedListener } from './events/listeners/user-completed-listener';
import { JobStatusUpdatedListener } from './events/listeners/job-status-updated-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
const start = async () => {
    console.log("starting jobs category service");
    // ENV VARIABLES

    if(!process.env.JWT_KEY){
        throw new Error('JWT must be defined');
    }

    // END ENV VARIABLES
    // -------------------
    // DB CONNECITON

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: 'gs://ta-jobs-category.appspot.com'
    });

    // storage = admin.storage();

    const firestore = admin.firestore();
    fireorm.initialize(firestore);

    console.log("Firebase initiation complete!");

    // END DB CONNECTION
    // -------------------
    // NATS CLIENT & LISTENERS

    try{
        await natsWrapper.connect('vrilance', 'qweert', 'http://ta-nats-srv:4222');

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
        new JobStatusUpdatedListener(natsWrapper.client).listen();
        new UserUpdatedListener(natsWrapper.client).listen();

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