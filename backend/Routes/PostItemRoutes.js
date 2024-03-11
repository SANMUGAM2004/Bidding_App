import express from 'express';
import { PostItem } from '../Models/PostItem.js';
import verifyToken from "../Middleware/Auth.js";
import { BiddingItem } from '../Models/BiddingItem.js';

const router = express.Router();

//Create Post for a item to be bidding..
router.post('/create', verifyToken, async (request,response) => { 
    // console.log(request.body);
    try{
        const { item_name,item_description, item_quantity, item_amount ,minimum_bidamount, item_enddate} = request.body;
        const userId = request.userId;
        const postItem = await PostItem.create({
            item_name,
            seller_id : userId,
            item_description,
            item_quantity,
            item_amount,
            minimum_bidamount,
            item_enddate,
        });
        // console.log(postItem);

        const biddingItem = await BiddingItem.create({
            item_id: postItem._id, 
            current_amount: postItem.item_amount, 
        });
        
        return response.json({status:'ok',postItem, message:"Item add successfully"});
    }
    catch(error){
        return response.json({status:'error' , error:error.message});
    }   
});

//Update the item..
router.put('/update/:itemId', async (request,response) => {
    try{
        const itemId = request.params.itemId;
        const updatedData = request.body;
        
        const updatedItem = await PostItem.findByIdAndUpdate(itemId, updatedData, { new: true });

        if(!updatedItem){
            return response.status(404).json({error : "Item Not Found"});
        }
        return response.status(200).json({message : "Item updated successfully", updatedItem});
    }
    catch(error){
        return response.json({status:'error', error: error.message});
    }
})


//delete the Item.
router.delete('/delete/:itemId', async (request,response) =>{
    try{
        const itemId = request.params.itemId;
        const deleteItem =  await PostItem.findByIdAndDelete(itemId);
        if(!deleteItem){
            return response.json({status:404,message : "Item already deleted"});
        }
        return response.status(200).json({message:"Item deleted Successfully"});
    }
    catch(error){
        return response.status(404).send(error);
    }
})

// Get all post items
router.get('/all', async (request, response) => {
    try {
        const allPostItems = await PostItem.find();

        // Check if there are no items
        if (!allPostItems || allPostItems.length === 0) {
            return response.status(404).json({ status: 'error', message: 'No post items found' });
        }
        // Return the list of post items
        return response.status(200).json({ status: 'ok', postItems: allPostItems });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});

// Get item by ID
router.get('/:itemId', async (request, response) => {
    try {
        const itemId = request.params.itemId;
        const item = await PostItem.findById(itemId);

        if (!item) {
            return response.status(404).json({ status: 'error', message: 'Item not found' });
        }

        return response.status(200).json({ status: 'ok', item });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});


export default router;