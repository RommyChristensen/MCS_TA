import { Collection, getRepository, IFirestoreVal } from 'fireorm';
import mongoose from 'mongoose';
import { AdsStatus } from './ads-status';

// definition model firestore
@Collection()
export class Ads {
    id: string;
    worker_id: string;
    title: string;
    description: string;
    category_id: string;
    category_name: string;
    status: AdsStatus;
    _v: number;
}

const create = async (worker_id: string, title: string, description: string, category_id: string, category_name: string) => {
    const repo = await getRepository(Ads);
    const ads = new Ads();
    ads.id = new mongoose.Types.ObjectId().toString();
    ads.worker_id = worker_id;
    ads.title = title;
    ads.description = description;
    ads.category_id = category_id;
    ads.category_name = category_name;
    ads.status = AdsStatus.Requested;
    ads._v = 0;

    return await repo.create(ads);
}

const getById = async (id: string) => {
    const repo = await getRepository(Ads);
    const ads = await repo.whereEqualTo('status', AdsStatus.Active).whereEqualTo('id', id).find();

    return ads[0];
}

const getByWorkerId = async (id: string) => {
    const repo = await getRepository(Ads);
    const ads = await repo.whereEqualTo('worker_id', id).find();

    return ads;
}

const getByCategoryId = async (id: string) => {
    const repo = await getRepository(Ads);
    const ads = await repo.whereEqualTo('category_id', id).whereEqualTo('status', AdsStatus.Active).find();

    return ads;
}

const getByCategoryIds = async (categories: IFirestoreVal[]) => {
    const repo = await getRepository(Ads);
    const ads = await repo.whereIn('category_id', categories).whereEqualTo('status', AdsStatus.Active).find();

    return ads;
}

const getAdsByStatus = async (status: AdsStatus) => {
    const repo = await getRepository(Ads);
    const ads = await repo.whereEqualTo('status', status).find();

    return ads;
}

const getAll = async () => {
    const repo = await getRepository(Ads);
    return await repo.find();
}

const changeStatus = async (id: string, status: AdsStatus) => {
    const repo = await getRepository(Ads);
    const ads = await repo.findById(id);

    ads.status = status;

    const updatedAds = await repo.update(ads);
    return updatedAds;
}

const updateAds = async (id: string, title?: string, description?: string) => {
    const repo = await getRepository(Ads);
    const ads = await repo.findById(id);

    if(title != null) ads.title = title;
    if(description != null) ads.description = description;

    const updatedAds = await repo.update(ads);

    return updatedAds;
}

class AdsDoc {
    create: (worker_id: string, title: string, description: string, category_id: string, category_name: string) => Promise<Ads>;
    getById: (id: string) => Promise<Ads>;
    getByWorkerId: (id: string) => Promise<Ads[]>;
    getByCategoryId: (id: string) => Promise<Ads[]>;
    getByCategoryIds: (categories: IFirestoreVal[]) => Promise<Ads[]>;
    getAdsByStatus: (status: AdsStatus) => Promise<Ads[]>;
    getAll: () => Promise<Ads[]>;
    changeStatus: (id: string, status: AdsStatus) => Promise<Ads>;
    updateAds: (id: string, title?: string, description?: string) => Promise<Ads>;
}

const adsDoc = new AdsDoc();
adsDoc.create = create;
adsDoc.getById = getById;
adsDoc.getByWorkerId = getByWorkerId;
adsDoc.getByCategoryId = getByCategoryId;
adsDoc.getByCategoryIds = getByCategoryIds;
adsDoc.getAdsByStatus = getAdsByStatus;
adsDoc.getAll = getAll;
adsDoc.changeStatus = changeStatus;
adsDoc.updateAds = updateAds;

export default adsDoc;
