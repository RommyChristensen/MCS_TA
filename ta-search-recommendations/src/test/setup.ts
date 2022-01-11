import admin from 'firebase-admin';
import * as fireorm from 'fireorm';
const serviceAccount = require('../../ServiceAccountKey.json');
import categoryDoc from '../models/category';

beforeAll(async () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const firestore = admin.firestore();
    fireorm.initialize(firestore);
});

beforeEach(async () => {
});

afterAll(async () => {
    console.log("Test Completed");
    await categoryDoc.deleteAll();
});