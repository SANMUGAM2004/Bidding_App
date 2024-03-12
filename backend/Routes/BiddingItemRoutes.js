import express from 'express';
import { PostItem } from '../Models/PostItem.js';
import { BiddingItem } from '../Models/BiddingItem.js';
import verifyToken from "../Middleware/Auth.js";
import mongoose from 'mongoose';

const router = express.Router();


// Update a bidding item
router.put('/update/:itemId', verifyToken, async (request, response) => {
    console.log(request.body);
    try {
        const buyerId = request.userId;
        const itemId = request.params.itemId;
        const filter = { item_id: itemId };
        //retrive the postitem by item id
        const item = await PostItem.findById(itemId);

        const biditem = await BiddingItem.findOne({item_id : itemId});
        console.log(biditem.current_amount);

        const current_amount = biditem.current_amount + item.minimum_bidamount; 

        const update = { buyer_id: buyerId, current_amount : current_amount, $inc: { bidding_count: 1 } }; // Increment bidding_count by 1

        // Find and update the bidding item
        const updatedBiddingItem = await BiddingItem.findOneAndUpdate(filter, update, { new: true });

        if (!updatedBiddingItem) {
            return response.status(404).json({ error: 'Bidding item not found' });
        }

        return response.status(200).json({
            status: 'ok',
            updatedBiddingItem: updatedBiddingItem,
            message: 'Bidding item updated successfully'
        });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});



// Get all bidding items
router.get('/all', async (request, response) => {
    try {
        const biddingItems = await BiddingItem.find();
        return response.status(200).json({ status: 'ok', biddingItems });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});

// Get bidding items corresponding to a specific item ID
router.get('/getbiditem/:itemId', async (request, response) => {
    try {
        const itemId = request.params.itemId;

        // Find all bidding items with the specified item ID
        const biddingItems = await BiddingItem.findOne({ item_id : new mongoose.Types.ObjectId(itemId) });

        return response.status(200).json({ status: 'ok', biddingItems });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});


// Get bidding item by ID
router.get('/get/:itemId', async (request, response) => {
    try {
        const itemId = request.params.itemId;

        // Find the bidding item with the specified item ID
        const biddingItem = await BiddingItem.findById(itemId);
        console.log(biddingItem);

        if (!biddingItem) {
            return response.status(404).json({ status: 'error', message: 'Bidding item not found' });
        }

        return response.status(200).json({ status: 'ok', biddingItem });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});

export default router;
