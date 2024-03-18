import { BiddingHistory } from "../Models/Biddinghistory.js";
import express from "express";
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();

// POST method to save bidding history
router.post('/biddinghistory', verifyToken,async (req, res) => {
    try {
        const { item_id, buyer_id, current_amount } = req.body;


        // Create a new bidding history document
        const biddingHistory = new BiddingHistory({
            item_id: item_id,
            buyer_id: buyer_id,
            current_amount: current_amount
        });

        // Save the bidding history to the database
        const savedBiddingHistory = await biddingHistory.save();

        res.status(201).json({ status: 'success', data: savedBiddingHistory });
    } catch (error) {
        console.error('Error saving bidding history:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


// GET method to retrieve last five buyers based on timestamp
router.get('/lastfivebuyers/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Retrieve the last five bidding history documents for the specified item ID,
        // sorted by timestamp in descending order
        const lastFiveBids = await BiddingHistory.find({ item_id: itemId })
            .sort({ timestamp: -1 })
            .limit(5);

        // Extract buyer IDs and current amounts from the last five bidding history documents
        const buyerData = lastFiveBids.map(bid => ({
            buyer_id: bid.buyer_id,
            current_amount: bid.current_amount
        }));

        res.status(200).json({ status: 'success', data: buyerData });
    } catch (error) {
        console.error('Error retrieving last five buyers:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


export default router;