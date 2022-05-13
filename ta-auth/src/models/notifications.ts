import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// definition model firestore
@Collection()
class Notification {
    id: string;
    user_id: string;
    topic: string;
    message: string;
    user_profile: string | null;
    read: boolean;
    _v: Number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (user_id: string, topic: string, message: string, user_profile?: string) => {
    const repo = await getRepository(Notification);
    const notif = new Notification();
    notif.id = new mongoose.Types.ObjectId().toString();
    notif.user_id = user_id;
    notif.topic = topic;
    notif.message = message;
    notif.user_profile = user_profile || null;
    notif.read = false;
    notif._v = 0;

    return await repo.create(notif);
}

const findById = async (id: string) => {
    const repo = await getRepository(Notification);
    const notification = await repo.findById(id);

    return notification;
}

const findByUserId = async (id: string) => {
    const repo = await getRepository(Notification);
    const notification = await repo.whereEqualTo('user_id', id).find();

    return notification;
}

const readNotification = async (id: string) => {
    const repo = await getRepository(Notification);
    const notification = await repo.findById(id);

    notification.read = true;

    const updatedNotification = await repo.update(notification);
    return updatedNotification;
}

// --------------------- End custom functions ------------------------------ //

// make class AdminDoc singleton
class NotificationDoc {
    create: (user_id: string, topic: string, message: string, user_profile?: string) => Promise<Notification>;
    findById: (id: string) => Promise<Notification>;
    findByUserId: (id: string) => Promise<Notification[]>;
    readNotification: (id: string) => Promise<Notification>;
}

// declare functions
const notificationDoc = new NotificationDoc();
notificationDoc.create = create;
notificationDoc.findById = findById;
notificationDoc.findByUserId = findByUserId;
notificationDoc.readNotification = readNotification;


export default notificationDoc;