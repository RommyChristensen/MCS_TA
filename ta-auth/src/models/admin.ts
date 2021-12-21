import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';
import { Password } from '../services/password';

// definition model firestore
@Collection()
class Admin {
    id: string;
    admin_username: string;
    admin_password: string;
    _v: Number;
}

// --------------------- Start custom functions ------------------------------ //

const createUser = async (username: string, password: string) => {
    const repo = await getRepository(Admin);
    const user = new Admin();
    user.id = new mongoose.Types.ObjectId().toString();
    user.admin_username = username;
    user.admin_password = await Password.toHash(password);
    user._v = 0;

    return await repo.create(user);
}

const checkUsername = async (username: string) => {
    const repo = await getRepository(Admin);
    const user = await repo.whereEqualTo('admin_username', username).find();
    return user.length != 0;
}

const findByUsername = async (username: string) => {
    const repo = await getRepository(Admin);
    const user = await repo.whereEqualTo('admin_username', username).find();
    return user[0];
}

const getAll = async () => {
    const repo = await getRepository(Admin);
    const users = await repo.find();
    return users;
}

const deleteAll = async () => {
    const repo = await getRepository(Admin);
    const users = await repo.find();

    users.forEach(async u => {
        return repo.delete(u.id);
    });

    return true;
}

const findById = async (adminId: string) => {
    const repo = await getRepository(Admin);
    const user = await repo.findById(adminId);

    return user;
}

// const updateUser = async (userId: string, ) => {
//     const repo = await getRepository(User);
//     const user = await repo.findById(userId);

//     user.auth_bio = data.bio;
//     user.auth_address = data.address;
//     user.auth_phone = data.phone;
//     user.auth_profile = data.profile;

//     const updatedUser = await repo.update(user);
//     return updatedUser;
// }

// --------------------- End custom functions ------------------------------ //

// make class AdminDoc singleton
class AdminDoc {
    create: (username: string, password: string) => Promise<Admin>;
    checkUsername: (username: string) => Promise<Boolean>;
    getAll: () => Promise<Admin[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (userId: string) => Promise<Admin>;
    findByUsername: (username: string) => Promise<Admin>;
    // checkEmail: (email: string) => Promise<Boolean>;
    // updateUser: (userId: string, data: UserCompleteData) => Promise<User>;
    // findByEmail: (email: string) => Promise<User[]>;
}

// declare functions
const adminDoc = new AdminDoc();
adminDoc.create = createUser;
adminDoc.checkUsername = checkUsername;
adminDoc.getAll = getAll;
adminDoc.deleteAll = deleteAll;
adminDoc.findById = findById;
adminDoc.findByUsername = findByUsername;
// userDoc.checkEmail = checkEmail;
// userDoc.updateUser = updateUser;
// userDoc.findByEmail = findByEmail;

export default adminDoc;