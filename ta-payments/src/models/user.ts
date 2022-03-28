import { Collection, getRepository } from 'fireorm';
import { HistoryTransaction } from './history-transaction';
import { TransactionStatus } from './transaction-status';
import mongoose from 'mongoose';

// FIX USER MODEL (PROPERTIES, METHODS)

// definition model firestore
@Collection()
export class User {
    id: string;
    auth_firstname: string;
    auth_lastname: string;
    auth_saldo: number;
    trans_history: Array<HistoryTransaction>;
    _v: Number;
}

// --------------------- Start custom functions ------------------------------ //

const createUser = async (id: string, firstname: string, _v: number, lastname?: string) => {
    const repo = await getRepository(User);
    const user = new User();
    user.id = id;
    user.auth_firstname = firstname;
    user.auth_lastname = lastname || '';
    user.auth_saldo = 0;
    user.trans_history = [];
    user._v = _v;

    return await repo.create(user);
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

const addNewTransaction = async (userId: string, value: number, method: String, orderId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    const now = new Date();
    const status = TransactionStatus.pending;
    
    user.trans_history.push(
        {
            id: orderId,
            transaction_date_time: now,
            transaction_method: method,
            transaction_status: status,
            transaction_value: value
        }
    );

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const updateTransaction = async (userId: string, status: TransactionStatus, orderId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    const history = user.trans_history.map(t => {
        if(t.id == orderId){
            t.transaction_status = status;
            return t;
        }else{
            return t;
        }
    });

    user.trans_history = history;
    const updatedUser = await repo.update(user);

    return updatedUser;
}


// --------------------- End custom functions ------------------------------ //

// make class UserDoc singleton
class UserDoc {
    create: (id: string, firstname: string, _v: number, lastname?: string) => Promise<User>;
    getAll: () => Promise<User[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (userId: string) => Promise<User>;
    addNewTransaction: (userId: string, value: number, method: String, orderId: string) => Promise<User>;
    updateTransaction: (userId: string, status: TransactionStatus, orderId: string) => Promise<User>;
}

// declare functions
const userDoc = new UserDoc();
userDoc.create = createUser;
userDoc.getAll = getAll;
userDoc.deleteAll = deleteAll;
userDoc.findById = findById;
userDoc.addNewTransaction = addNewTransaction;
userDoc.updateTransaction = updateTransaction;

export default userDoc;