import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// definition model firestore
@Collection()
class Verification {
    id: string;
    user_id: string;
    verification_token: string;
    verification_expires_at: number;
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (token: string, userId: string) => {
    const repo = await getRepository(Verification);
    const verification = new Verification();
    verification.id = new mongoose.Types.ObjectId().toString();
    verification.verification_token = token;
    verification.user_id = userId;
    verification._v = 0;

    let now = new Date();
    now.setDate(now.getDate() + 1);
    verification.verification_expires_at = now.valueOf();

    return await repo.create(verification);
}

const findByUserId = async (userId: string) => {
    const repo = await getRepository(Verification);
    const verification = await repo.whereEqualTo('user_id', userId).find();
    return verification[0];
}

const findByUserIdValid = async (userId: string) => {
    const repo = await getRepository(Verification);
    const verification = await repo.whereEqualTo('user_id', userId).whereGreaterOrEqualThan(verification => verification.verification_expires_at, new Date().valueOf()).find();
    return verification[0];
}

const getAll = async () => {
    const repo = await getRepository(Verification);
    const verifications = await repo.find();
    return verifications;
}

const deleteAll = async () => {
    const repo = await getRepository(Verification);
    const verifications = await repo.find();

    verifications.forEach(async v => {
        return repo.delete(v.id);
    });

    return true;
}

const findById = async (verificationId: string) => {
    const repo = await getRepository(Verification);
    const verification = await repo.findById(verificationId);

    return verification;
}

// --------------------- End custom functions ------------------------------ //

// make class VerificationDoc singleton
class VerificationDoc {
    create: (token: string, userId: string) => Promise<Verification>;
    findByUserId: (userId: string) => Promise<Verification>;
    getAll: () => Promise<Verification[]>;
    deleteAll: () => Promise<Boolean>;
    findByUserIdValid: (userId: string) => Promise<Verification>;
    findById: (verificationId: string) => Promise<Verification>;
    // checkEmail: (email: string) => Promise<Boolean>;
    // updateUser: (userId: string, data: UserCompleteData) => Promise<User>;
    // findByEmail: (email: string) => Promise<User[]>;
}

// declare functions
const verificationDoc = new VerificationDoc();
verificationDoc.create = create;
verificationDoc.findByUserId = findByUserId;
verificationDoc.findByUserIdValid = findByUserIdValid;
verificationDoc.getAll = getAll;
verificationDoc.deleteAll = deleteAll;
verificationDoc.findById = findById;

export default verificationDoc;