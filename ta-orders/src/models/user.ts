import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// FIX USER MODEL (PROPERTIES, METHODS)

// definition model firestore
@Collection()
export class User {
    id: string;
    auth_firstname: string;
    auth_lastname: string;
    auth_username: string;
    auth_email: string;
    auth_verified: Boolean;
    auth_confirmed: Boolean;
    auth_role: string;
    auth_phone: string;
    auth_profile: string;
    _v: Number;
}

interface UserCompleteData {
    bio: string;
    address: string;
    profile: string;
    phone: string;
}

// --------------------- Start custom functions ------------------------------ //

const createUser = async (id: string, username: string, email: string, verified: Boolean, confirmed: Boolean, firstname: string, _v: number, lastname?: string, role?: string) => {
    const repo = await getRepository(User);
    const user = new User();
    user.id = id;
    user.auth_username = username;
    user.auth_email = email;
    user.auth_verified = verified;
    user.auth_role = role || '';
    user.auth_firstname = firstname;
    user.auth_lastname = lastname || '';
    user.auth_confirmed = confirmed;
    user._v = _v;

    return await repo.create(user);
}

const checkUsername = async (username: string) => {
    const repo = await getRepository(User);
    const user = await repo.whereEqualTo('auth_username', username).find();
    return user.length == 0;
}

const checkEmail = async (email: string) => {
    const repo = await getRepository(User);
    const user = await repo.whereEqualTo('auth_email', email).find();
    return user.length == 0;
}

const findByEmail = async (email: string) => {
    const repo = await getRepository(User);
    const user = await repo.whereEqualTo('auth_email', email).find();
    return user;
}

const getAll = async () => {
    const repo = await getRepository(User);
    const users = await repo.find();
    return users;
}

const deleteAll = async () => {
    const repo = await getRepository(User);
    const users = await repo.find();

    users.forEach(async u => {
        return repo.delete(u.id);
    });

    return true;
}

const findById = async (userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    return user;
}

const updateUser = async (userId: string, data: UserCompleteData) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.auth_phone = data.phone;
    user.auth_profile = data.profile;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const verifyUser = async (userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.auth_verified = true;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const confirmUser = async (userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.auth_confirmed = true;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

// --------------------- End custom functions ------------------------------ //

// make class UserDoc singleton
class UserDoc {
    create: (id: string, username: string, email: string, verified: Boolean, confirmed: Boolean, firstname: string, _v: number, lastname?: string, role?: string) => Promise<User>;
    checkUsername: (username: string) => Promise<Boolean>;
    checkEmail: (email: string) => Promise<Boolean>;
    getAll: () => Promise<User[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (userId: string) => Promise<User>;
    updateUser: (userId: string, data: UserCompleteData) => Promise<User>;
    findByEmail: (email: string) => Promise<User[]>;
    verifyUser: (userId: string) => Promise<User>; 
    confirmUser: (userId: string) => Promise<User>;
}

// declare functions
const userDoc = new UserDoc();
userDoc.create = createUser;
userDoc.checkUsername = checkUsername;
userDoc.checkEmail = checkEmail;
userDoc.getAll = getAll;
userDoc.deleteAll = deleteAll;
userDoc.findById = findById;
userDoc.updateUser = updateUser;
userDoc.findByEmail = findByEmail;
userDoc.verifyUser = verifyUser;
userDoc.confirmUser = confirmUser;

export default userDoc;

// refresh token : 1//04cDhVO9dYN6BCgYIARAAGAQSNwF-L9Ir50woCVowPeHaRBOmYz2BAGafobvc3dtB4ySZvI3wYn2eGkQM31WPFK-iwm2xzvJTHKo