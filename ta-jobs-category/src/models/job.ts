import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';
import { User } from './user';

export enum JobStatus {
    aktif = "Aktif",
    nonaktif = "Non Aktif",
    selesai = "Selesai"
}

// definition model firestore
export interface Cat {
    category_name: string;
    category_description: string;
    id: string;
}

@Collection()
class Job {
    id: string;
    job_title: string;
    job_description: string;
    job_date: Date;
    job_created_by: string | User; // user id
    job_created_at: Date;
    job_status: JobStatus;
    job_price: number;
    job_category: Cat; // category id
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (title: string, description: string, date: Date, createdBy: string, price: number, category: Cat, createdAt: Date) => {
    const repo = await getRepository(Job);
    const job = new Job();
    job.id = new mongoose.Types.ObjectId().toString();
    job.job_title = title;
    job.job_description = description;
    job.job_date = date;
    job.job_created_by = createdBy;
    job.job_price = price;
    job.job_category = category;
    job.job_status = JobStatus.aktif;
    job.job_created_at = createdAt;
    job._v = 0;

    return await repo.create(job);
}

const findByUserId = async (userId: string) => {
    const repo = await getRepository(Job);
    const job = await repo.whereEqualTo('job_created_by', userId).find();
    
    return job;
}

const getAll = async () => {
    const repo = await getRepository(Job);
    const jobs = await repo.find();

    return jobs;
}

const deleteAll = async () => {
    const repo = await getRepository(Job);
    const jobs = await repo.find();

    jobs.forEach(async j => {
        return repo.delete(j.id);
    });

    return true;
}

const findById = async (jobId: string) => {
    const repo = await getRepository(Job);
    const job = await repo.findById(jobId);

    return job;
}

const deleteById = async (jobId: string) => {
    const repo = await getRepository(Job);
    const job = await repo.findById(jobId);
    await repo.delete(jobId);

    if(await repo.findById(jobId)){
        return false;
    }else{
        return job;
    }
}

const updateJob = async (jobId: string, title?: string, description?: string, price?: number, date?: Date) => {
    const repo = await getRepository(Job);
    const job = await repo.findById(jobId);

    if(title != null) job.job_title = title;
    if(description != null) job.job_description = description;
    if(price != null) job.job_price = price;
    if(date != null) job.job_date = date;

    if(title == null && description == null && price == null && date == null){
        return job;
    }

    const updatedJob = await repo.update(job);

    return updatedJob;
}

const updateStatusJob = async (jobId: string, status: JobStatus) => {
    const repo = await getRepository(Job);
    const job = await repo.findById(jobId);

    job.job_status = status;
    
    const updatedJob = await repo.update(job);

    return updatedJob;
}

const getByMonth = async (month: number) => {
    const repo = await getRepository(Job);
    const job = await repo.find();

    const filtered = job.filter(j => {
        const date = new Date(j.job_created_at);
        const m = date.getMonth();

        return m === month;
    });

    return filtered;
}

// --------------------- End custom functions ------------------------------ //

// make class JobDoc singleton
class JobDoc {
    create: (title: string, description: string, date: Date, createdBy: string, price: number, category: Cat, createdAt: Date) => Promise<Job>;
    findByUserId: (userId: string) => Promise<Job[]>;
    getAll: () => Promise<Job[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (jobId: string) => Promise<Job>;
    deleteById: (jobId: string) => Promise<false | Job>;
    updateJob: (jobId: string, title: string, description: string, price: number, date: Date) => Promise<Job>;
    updateStatusJob: (jobId: string, status: JobStatus) => Promise<Job>;
    getByMonth: (month: number) => Promise<Job[]>;
}

// declare functions
const jobDoc = new JobDoc();
jobDoc.create = create;
jobDoc.findByUserId = findByUserId;
jobDoc.findById = findById;
jobDoc.getAll = getAll;
jobDoc.deleteAll = deleteAll;
jobDoc.deleteById = deleteById;
jobDoc.updateJob = updateJob;
jobDoc.updateStatusJob = updateStatusJob;
jobDoc.getByMonth = getByMonth;

export default jobDoc;