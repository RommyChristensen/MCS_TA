import { Collection, getRepository, IFirestoreVal } from 'fireorm';
import mongoose from 'mongoose';
import { User } from './user';

// definition model firestore
@Collection()
export class Job {
    id: string;
    job_title: string;
    job_description: string;
    job_date: Date;
    job_created_by: string | User; // user id
    job_created_at: Date;
    job_status: string;
    job_price: number;
    job_category: string; // category id
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (id: string, title: string, description: string, date: Date, createdBy: string, price: number, category: string, createdAt: Date) => {
    const repo = await getRepository(Job);
    const job = new Job();
    job.id = id;
    job.job_title = title;
    job.job_description = description;
    job.job_date = date;
    job.job_created_by = createdBy;
    job.job_price = price;
    job.job_category = category;
    job.job_status = 'Created';
    job.job_created_at = createdAt;
    job._v = 0;

    return await repo.create(job);
}

const findByUserId = async (userId: string) => {
    const repo = await getRepository(Job);
    const job = await repo.whereEqualTo('job_created_by', userId).find();
    return job[0];
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

const getJobByCategory = async (categories: IFirestoreVal[]) => {
    const repo = await getRepository(Job);
    const jobs = await repo.whereIn('job_category', categories).find();

    return jobs;
}

// --------------------- End custom functions ------------------------------ //

// make class JobDoc singleton
class JobDoc {
    create: (id: string, title: string, description: string, date: Date, createdBy: string, price: number, category: string, createdAt: Date) => Promise<Job>;
    findByUserId: (userId: string) => Promise<Job>;
    getAll: () => Promise<Job[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (jobId: string) => Promise<Job>;
    deleteById: (jobId: string) => Promise<false | Job>;
    updateJob: (jobId: string, title: string, description: string, price: number, date: Date) => Promise<Job>;
    getJobByCategory: (categories: IFirestoreVal[]) => Promise<Job[]>;
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
jobDoc.getJobByCategory = getJobByCategory;

export default jobDoc;