import express, { response } from 'express';
import { Category } from '../Models/Category.js';

const router = express.Router()

//Create a new Category
router.post('/create', async (request,respond) => {
    try{
        const category_name = request.body;
        const category = await Category.create({
            category_name
        })
        return response.json({status : 'ok', category , message :"Category successfully added"});

    }
    catch(error){
        return response.status(404).send(error);
    }
})

//Delete the existing Category
router.delete('/delete/:categoryId', async (request,response)=>{
    try{
        const categoryId = request.categoryId;
        const deleteCategory = await Category.findByIdAndDelete(categoryId);

        if(!deleteCategory){
            return response.send({message : "Category is already deleted"});
        }
        return response.status(200).json({message:"successfully deleted"});
    }
    catch(error){
        return response.send(error);
    }
})
export default router;