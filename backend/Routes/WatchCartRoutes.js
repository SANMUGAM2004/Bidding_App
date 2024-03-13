import { WatchCart } from "../Models/WatchCart.js";
import express from "express";
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();

// Create the route to add an item to the watchlist
router.post('/additem/:itemId', verifyToken, async (request, response) => {
    try {
        const userId = request.userId;
        const itemId = request.params.itemId;
        // Check if the item is already in the user's watchlist
        const existingItem = await WatchCart.findOne({ item_id: itemId, buyer_id: userId });
        if (existingItem) {
            return response.status(400).json({ status: 'error', message: 'Item already exists in watchlist' });
        }

        // Add the item to the watchlist
        const watchlistItem = await WatchCart.create({ item_id: itemId, buyer_id: userId });
        return response.status(200).json({ status: 'ok', watchlistItem, message: 'Item added to watchlist successfully' });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});

//Remove from watchcart
router.delete('/deleteitem/:itemId', verifyToken, async (request,response) => {
    console.log(request.body);
    try{
        const itemId = request.params.itemId;
        const userId = request.userId;
        // Delete the bidding item by item_id
        const result = await WatchCart.deleteOne({ item_id: itemId , buyer_id : userId});

        if(!result){
            throw new Error("this item in watch cart is already deleted");
        }
        return response.json({status:"ok",message:"deleted successfully"});

    }
    catch(error){
        return response.json({status:'error',message : error.message});
    }
})

//Remove from watchcart using item id
router.delete('/delete/:itemId', verifyToken, async (request,response) => {
    console.log(request.body);
    try{
        const itemId = request.params.itemId;
        //const userId = request.userId;
        // Delete the bidding item by item_id
        const result = await WatchCart.deleteMany({ item_id: itemId });

        if(!result){
            throw new Error("this item in watch cart is already deleted");
        }
        return response.json({status:"ok",message:"deleted successfully"});

    }
    catch(error){
        return response.json({status:'error',message : error.message});
    }
})

//get item ffrom the watch cart
router.get('/getitems', verifyToken, async (request, response) => {
    try {
        console.log(request.body);
        const buyerId = request.userId; // Get the user ID from the token

        if (!buyerId) {
            throw new Error("User ID is not defined");
        }

        // Find all items in the watchcart where buyer_id matches the logged-in user's ID
        const watchcartItems = await WatchCart.find({ buyer_id: buyerId })

        return response.json({ status: 'ok', watchcartItems });
    } catch (error) {
        return response.json({ status: 'error', message: error.message });
    }
});


export default router;