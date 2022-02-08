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

const create = async (categoryName: string, categoryDesc: string) => {
    const repo = await getRepository(Category);
    const category = new Category();
    category.id = new mongoose.Types.ObjectId().toString();
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

const getCategoryByName = async (query: string) => {
    const repo = await getRepository(Category);
    const categories = await repo.find();

    const filteredCategories = categories.filter(c => {
        const categoryName = c.category_name.toLowerCase();

        return c.category_name.includes(query);
    });

    return filteredCategories;
}

// --------------------- End custom functions ------------------------------ //

// make class VerificationDoc singleton
class CategoryDoc {
    create: (categoryName: string, categoryDesc: string) => Promise<Category>;
    getAll: () => Promise<Category[]>;
    deleteAll: () => Promise<Boolean>;
    findById: (categoryId: string) => Promise<Category>;
    deleteById: (categoryId: string) => Promise<Boolean>;
    updateCategory: (categoryId: string, categoryName: string, categoryDescription: string) => Promise<Category>;
    getCategoryByname: (query: string) => Promise<Category[]>;
}

// declare functions
const categoryDoc = new CategoryDoc();
categoryDoc.create = create;
categoryDoc.findById = findById;
categoryDoc.getAll = getAll;
categoryDoc.deleteAll = deleteAll;
categoryDoc.deleteById = deleteById;
categoryDoc.updateCategory = updateCategory;
categoryDoc.getCategoryByname = getCategoryByName;

export default categoryDoc;