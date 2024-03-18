import express from 'express';
import { PostItem } from '../Models/PostItem.js';
import { BiddingItem } from '../Models/BiddingItem.js';
import verifyToken from "../Middleware/Auth.js";
import mongoose from 'mongoose';

const router = express.Router();
//Create user for bidding item
router.post('/create/:itemId',verifyToken, async (request,response) =>{
    console.log(request.body);
    try{
        const buyerId = request.userId;
        const itemId = request.params.itemId;
        const bidAmount = request.body.bidAmount;
        const filter =  { item_id : itemId};
        const timestamp = new Date();
        //retrive the postitem by item Id
        const item = await PostItem.findById(itemId);
        // const biditem = await BiddingItem.findOne({item_id:itemId});
        console.long(biditem.current_amount);
        const current_amount = parseInt(biditem.current_amount) + parseInt(bidAmount);
        const bidding_count = bidding_count + 1;
        const biditem = await BiddingItem.create({
            buyer_id : buyerId,
            item_id : itemId,
            current_amount : current_amount,
            bidding_count : bidding_count,

        });
        return response.json({status:'ok', biditem, message:"Your Bidding is successfully placed"});

    }catch(error){
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
})


// Update a bidding item
router.put('/update/:itemId', verifyToken, async (request, response) => {
    console.log(request.body);
    try {
        const userId = request.userId;
        const buyerId = request.userId;
        const itemId = request.params.itemId;
        const bidAmount = request.body.bidAmount;
        const filter = { item_id: itemId };
        //retrive the postitem by item id
        const item = await PostItem.findById(itemId);

        const biditem = await BiddingItem.findOne({item_id : itemId});
        console.log(biditem.current_amount);

        const current_amount = parseInt(biditem.current_amount) + parseInt(bidAmount); 

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


// // Get bidding item by ID
// router.get('/get/:itemId', async (request, response) => {
//     try {
//         const itemId = request.params.itemId;

//         // Find the bidding item with the specified item ID
//         const biddingItem = await BiddingItem.findById(itemId);
//         console.log(biddingItem);

//         if (!biddingItem) {
//             return response.status(404).json({ status: 'error', message: 'Bidding item not found' });
//         }

//         return response.status(200).json({ status: 'ok', biddingItem });
//     } catch (error) {
//         return response.status(500).json({ status: 'error', error: error.message });
//     }
// });
// Get bidding item by ID
router.get('/get/:itemId', async (request, response) => {
    try {
        const itemId = request.params.itemId;

        // Find the bidding item with the specified item ID, sorted by timestamp in descending order
        const biddingItem = await BiddingItem.findOne({ item_id: itemId })
            .sort({ createdAt: -1 });

        if (!biddingItem) {
            return response.status(404).json({ status: 'error', message: 'Bidding item not found' });
        }

        return response.status(200).json({ status: 'ok', biddingItem });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});


//Retrieve the last five bid users
router.get('/lastFiveBids/:itemId', async (request, response) => {
    try {
        const itemId = request.params.itemId;
        
        // Retrieve the last five bids sorted by timestamp
        const lastFiveBids = await BiddingItem.find({ item_id: itemId })
            .sort({ createdAt: -1 }) // Sort by descending order of createdAt timestamp
            .limit(5); // Limit to five bids
        
        if (lastFiveBids.length === 0) {
            // If no bids are available, show the details of the available bid
            const availableBid = await BiddingItem.findOne({ item_id: itemId });
            if (!availableBid) {
                return response.status(404).json({ message: "No bids available for this item" });
            }
            return response.status(200).json({ availableBid });
        }

        response.status(200).json({ lastFiveBids });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
});

export default router;
