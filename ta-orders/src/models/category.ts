import { Collection, getRepository } from 'fireorm';
import mongoose from 'mongoose';

// definition model firestore
@Collection()
export class Category {
    id: string;
    category_name: string;
    category_description: string;
    _v: number;
}

// --------------------- Start custom functions ------------------------------ //

const create = async (id: string, categoryName: string, categoryDesc: string) => {
    const repo = await getRepository(Category);
    const category = new Category();
    category.id = id;
    category.category_name = categoryName;
    category.category_description = categoryDesc;
    category._v = 0;

    return await repo.create(category);
}

const getAll = async () => {
    const repo = await getRepository(Category);
    const categories = await repo.find();
    return categories;
}

const deleteAll = async () => {
    const repo = await getRepository(Category);
    const categories = await repo.find();

    categories.forEach(async c => {
        return repo.delete(c.id);
    });

    return true;
}

const findById = async (categoryId: string) => {
    const repo = await getRepository(Category);
    const category = await repo.findById(categoryId);

    return category;
}

const deleteById = async (categoryId: string) => {
    const repo = await getRepository(Category);
    await repo.delete(categoryId);

    if(await repo.findById(categoryId)){
        return false;
    }else{
        return true;
    }
}

const updateCategory = async (catId: string, catName: string, catDescription: string) => {
    const repo = await getRepository(Category);
    const category = await repo.findById(catId);

    category.category_name = catName;
    category.category_description = catDescription;
    
    await repo.update(category);

    return category;
} 

// --------------------- End custom functions ------------------------------ //

// make class VerificationDoc singleton
class CategoryDoc {
    create: (id: string, categoryName: string, categoryDesc: string) => Promise<Category>;
    getAll: () => Promise<Category[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (categoryId: string) => Promise<Category>;
    deleteById: (categoryId: string) => Promise<Boolean>;
    updateCategory: (categoryId: string, categoryName: string, categoryDescription: string) => Promise<Category>;
}

// declare functions
const categoryDoc = new CategoryDoc();
categoryDoc.create = create;
categoryDoc.findById = findById;
categoryDoc.getAll = getAll;
categoryDoc.deleteAll = deleteAll;
categoryDoc.deleteById = deleteById;
categoryDoc.updateCategory = updateCategory;

export default categoryDoc;