import express from 'express';
import { PostItem } from '../Models/PostItem.js';
import { BiddingItem } from '../Models/BiddingItem.js';
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();


// Update a bidding item
router.put('/update/:itemId', verifyToken, async (request, response) => {
    try {
        const buyerId = request.userId;
        const itemId = request.params.itemId;

        // Find the bidding item by item ID
        let biddingItem = await BiddingItem.findOne({ item: itemId });

        // Check if the bidding item exists
        if (!biddingItem) {
            return response.status(404).json({ error: 'Bidding item not found' });
        }

        // Find the item to retrieve the minimum bid amount
        const item = await PostItem.findById(itemId);

        const bidding_amount = item.minimum_bidamount + biddingItem.bidding_amount;
        const bidding_count = biddingItem.bidding_count + 1;

        // Update bidding item
        biddingItem = await BiddingItem.findOneAndUpdate(
            { item: itemId },
            { buyer: buyerId, bidding_amount, bidding_count },
            { new: true }
        );

        return response.status(200).json({
            status: 'ok',
            biddingItem,
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
        const biddingItems = await BiddingItem.find({ item: itemId });

        return response.status(200).json({ status: 'ok', biddingItems });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});

export default router;
