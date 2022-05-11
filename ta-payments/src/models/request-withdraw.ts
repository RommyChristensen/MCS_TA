import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// collection class
@Collection()
export class Withdraw {
    id: string;
    user_id: string;
    amount: number;
    request_at: Date;
    accepted_at: Date | null;
    rejected_at: Date | null;
    transfer_prove: string | null;
    status: WithdrawalStatus;
    _v: Number;
}

export enum WithdrawalStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}

const createWithdraw = async (user_id: string, amount: number) => {
    const repo = await getRepository(Withdraw);
    const withdraw = new Withdraw();
    withdraw.id = new mongoose.Types.ObjectId().toString();
    withdraw.user_id = user_id;
    withdraw.amount = amount;
    withdraw.request_at = new Date(new Date().toLocaleString('en-US', {timeZone: "Asia/Jakarta"}));
    withdraw.transfer_prove = null;
    withdraw.accepted_at = null;
    withdraw.rejected_at = null;
    withdraw.status = WithdrawalStatus.pending;
    withdraw._v = 0;

    return await repo.create(withdraw);
}

const getByUserId = async (user_id: string) => {
    const repo = await getRepository(Withdraw);
    const withdraws = await repo.whereEqualTo('user_id', user_id).find();
    return withdraws;
}

const getById = async (id: string) => {
    const repo = await getRepository(Withdraw);
    const withdraws = await repo.findById(id);
    return withdraws;
}

const getAll = async () => {
    const repo = await getRepository(Withdraw);
    const withdraws = await repo.find();
    return withdraws;
}

const updateStatus = async (id: string, status: WithdrawalStatus, transfer_prove?: string) => {
    const repo = await getRepository(Withdraw);
    const withdraw = await repo.findById(id);

    if(status == WithdrawalStatus.accepted){
        if(transfer_prove == null) return;

        withdraw.accepted_at = new Date(new Date().toLocaleString('en-US', {timeZone: "Asia/Jakarta"}));
        withdraw.transfer_prove = transfer_prove;
    }else if(status == WithdrawalStatus.rejected){
        withdraw.rejected_at = new Date(new Date().toLocaleString('en-US', {timeZone: "Asia/Jakarta"}));
    }

    withdraw.status = status;

    const updatedWithdraw = await repo.update(withdraw);
    return updatedWithdraw;
}

const getPendingRequest = async (user_id: string) => {
    const repo = await getRepository(Withdraw);
    const withdraw = await repo.whereEqualTo('user_id', user_id).whereEqualTo('status', WithdrawalStatus.pending).find();
    return withdraw;
}

// make class UserDoc singleton
class WithdrawDoc {
    create: (user_id: string, amount: number) => Promise<Withdraw>;
    getByUserId: (user_id: string) => Promise<Withdraw[]>;
    getById: (id: string) => Promise<Withdraw>;
    getAll: () => Promise<Withdraw[]>;
    updateStatus: (id: string, status: WithdrawalStatus, transfer_prove?: string) => Promise<Withdraw | undefined>;
    getPendingRequest: (user_id: string) => Promise<Withdraw[]>;
}

const withdrawDoc = new WithdrawDoc();
withdrawDoc.create = createWithdraw;
withdrawDoc.getByUserId = getByUserId;
withdrawDoc.getById = getById;
withdrawDoc.getAll = getAll;
withdrawDoc.updateStatus = updateStatus;
withdrawDoc.getPendingRequest = getPendingRequest;

export default withdrawDoc;