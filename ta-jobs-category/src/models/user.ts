import { Collection, getRepository, IFirestoreVal } from 'fireorm';
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
    auth_role: string;
    auth_address: string;
    auth_phone: string;
    auth_profile: string;
    auth_bio: string;
    auth_confirmed: Boolean;
    auth_completed: Boolean;
    auth_gender: string;
    auth_birthdate: Date;
    preferred_category: string;
    _v: Number;
}

interface UserCompleteData {
    bio: string;
    address: string;
    profile: string;
    phone: string;
    gender: string;
    birthdate: Date;
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
    user.auth_completed = false;
    user.preferred_category = '';

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

    user.auth_bio = data.bio;
    user.auth_address = data.address;
    user.auth_phone = data.phone;
    user.auth_profile = data.profile;
    user.auth_gender = data.gender;
    user.auth_birthdate = data.birthdate;
    user.auth_completed = true;

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

const changepp = async (userId: string, path: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.auth_profile = path;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

export interface changeProfileData {
    firstname: string | null;
    lastname: string | null;
    address: string | null;
    bio: string | null;
    phone: string | null;
}

const changeProfile = async (userId: string, userData: changeProfileData) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    if(userData.firstname !== null) user.auth_firstname = userData.firstname;
    if(userData.lastname !== null) user.auth_lastname = userData.lastname;
    if(userData.address !== null) user.auth_address = userData.address;
    if(userData.bio !== null) user.auth_bio = userData.bio;
    if(userData.phone !== null) user.auth_phone = userData.phone;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const addPreferredCategory = async (userId: string, categoryId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.preferred_category = categoryId;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const getByPreferredCategory = async (categories: IFirestoreVal[]) => {
    const repo = await getRepository(User);
    const users = await repo.whereIn('preferred_category', categories).find();

    return users;
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
    changepp: (userId: string, path: string) => Promise<User>;
    changeProfile: (userId: string, userData: changeProfileData) => Promise<User>;
    changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<Object>;
    addPreferredCategory: (userId: string, categoryId: string) => Promise<User>;
    getPreferredCategory: (categories: IFirestoreVal[]) => Promise<User[]>;
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
userDoc.changepp = changepp;
userDoc.changeProfile = changeProfile;
userDoc.addPreferredCategory = addPreferredCategory;
userDoc.getPreferredCategory = getByPreferredCategory;

export default userDoc;

// refresh token : 1//04cDhVO9dYN6BCgYIARAAGAQSNwF-L9Ir50woCVowPeHaRBOmYz2BAGafobvc3dtB4ySZvI3wYn2eGkQM31WPFK-iwm2xzvJTHKo