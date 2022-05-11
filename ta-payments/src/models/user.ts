import { Collection, getRepository } from 'fireorm';
import { HistoryTransaction } from './history-transaction';
import { TransactionStatus } from './transaction-status';
import mongoose from 'mongoose';
import { BCAInterface } from '../interfaces/bca-interface';
import { BNIInterface } from '../interfaces/bni-interface';
import { PermataInterface } from '../interfaces/permata-interface';
import { OrderHistory } from './order-history';
import { OrderPaymentStatus } from './order-payment-status';

// FIX USER MODEL (PROPERTIES, METHODS)

// definition model firestore
@Collection()
export class User {
    id: string;
    auth_firstname: string;
    auth_lastname: string;
    auth_saldo: number;
    auth_role: string;
    current_transaction: BCAInterface | BNIInterface | PermataInterface | null;
    trans_history: Array<HistoryTransaction>;
    order_history: Array<OrderHistory>;
    card_number: string | null;
    bank: string | null;
    card_name: string | null;
    payment_data_complete: boolean;
    _v: Number;
}

export interface DetailPaymentData {
    card_number: string;
    card_name: string;
    bank: string;
}

// --------------------- Start custom functions ------------------------------ //

const createUser = async (id: string, firstname: string, _v: number, role: string, lastname?: string) => {
    const repo = await getRepository(User);
    const user = new User();
    user.id = id;
    user.auth_firstname = firstname;
    user.auth_lastname = lastname || '';
    user.auth_saldo = 0;
    user.trans_history = [];
    user.current_transaction = null;
    user.order_history = [];
    user._v = _v;
    user.auth_role = role;
    user.card_number = null;
    user.bank = null;
    user.card_name = null;
    user.payment_data_complete = false;

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

const updateSaldo = async (userId: string, saldo: number) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    console.log(saldo);
    console.log(user.auth_saldo);
    console.log(saldo + user.auth_saldo);
    
    let s = user.auth_saldo + saldo;
    user.auth_saldo = s;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const addCurrentTransaction = async (data: BCAInterface | BNIInterface | PermataInterface, userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.current_transaction = data;
    const updatedUser = await repo.update(user);
    return updatedUser;
}

const removeCurrentTransaction = async (userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.current_transaction = null;
    const updatedUser = await repo.update(user);
    return updatedUser;
}


const addNewTransaction = async (userId: string, value: number, method: String, orderId: string, datetime: string, status: TransactionStatus) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.trans_history.push(
        {
            id: orderId,
            transaction_date_time: datetime,
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
    if(status == TransactionStatus.settlement && user.current_transaction != null) user.auth_saldo += parseInt(user.current_transaction!.gross_amount);
    const updatedUser = await repo.update(user);

    return updatedUser;
}

const addOrderHistory = async (userId: string, orderId: string, status: OrderPaymentStatus, amount: number) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    const history = user.order_history;
    history.push({
        id: new mongoose.Types.ObjectId().toString(),
        status: status,
        order_id: orderId,
        amount: amount,
    });
    user.order_history = history;

    const updatedOrderHistory = await repo.update(user);
    return updatedOrderHistory;
}

const updateOrderHistory = async (orderId: string, userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    const orderHistory = user.order_history.map(o => {
        if(o.order_id == orderId){
            o["status"] = OrderPaymentStatus.done;
        }
        return o;
    });

    user.order_history = orderHistory;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const updatePaymentData = async (userId: string, card_name: string, card_number: string, bank: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    user.card_name = card_name;
    user.card_number = card_number;
    user.bank = bank;
    user.payment_data_complete = true;

    const updatedUser = await repo.update(user);
    return updatedUser;
}

const getPaymentData = async (userId: string) => {
    const repo = await getRepository(User);
    const user = await repo.findById(userId);

    return {
        card_name: user.card_name,
        card_number: user.card_number,
        bank: user.bank
    } as DetailPaymentData;
}


// --------------------- End custom functions ------------------------------ //

// make class UserDoc singleton
class UserDoc {
    create: (id: string, firstname: string, _v: number, role: string, lastname?: string) => Promise<User>;
    getAll: () => Promise<User[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (userId: string) => Promise<User>;
    addNewTransaction: (userId: string, value: number, method: String, orderId: string, datetime: string, status: TransactionStatus) => Promise<User>;
    updateTransaction: (userId: string, status: TransactionStatus, orderId: string) => Promise<User>;
    addCurrentTransaction: (data: BCAInterface | BNIInterface | PermataInterface, userId: string) => Promise<User>;
    removeCurrentTransaction: (userId: string) => Promise<User>;
    updateSaldo: (userId: string, saldo: number) => Promise<User>;
    addOrderHistory: (userId: string, orderId: string, status: OrderPaymentStatus, amount: number) => Promise<User>;
    updateOrderHistory: (orderId: string, userId: string) => Promise<User>;
    updatePaymentData: (userId: string, card_name: string, card_number: string, bank: string) => Promise<User>;
    getPaymentData: (userId: string) => Promise<DetailPaymentData>;
}

// declare functions
const userDoc = new UserDoc();
userDoc.create = createUser;
userDoc.getAll = getAll;
userDoc.deleteAll = deleteAll;
userDoc.findById = findById;
userDoc.addNewTransaction = addNewTransaction;
userDoc.updateTransaction = updateTransaction;
userDoc.addCurrentTransaction = addCurrentTransaction;
userDoc.removeCurrentTransaction = removeCurrentTransaction;
userDoc.updateSaldo = updateSaldo;
userDoc.addOrderHistory = addOrderHistory;
userDoc.updateOrderHistory = updateOrderHistory;
userDoc.updatePaymentData = updatePaymentData;
userDoc.getPaymentData = getPaymentData;

export default userDoc;