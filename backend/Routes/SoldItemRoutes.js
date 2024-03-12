import express from 'express';
import { SoldItem } from '../Models/SoldItem.js';
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();

//create a sold_item
router.post('/create', async (request,response) => {
    try{
        const  {buyer_id , item_id } = request.body;

        // Validate the presence of both buyer_id and item_id
        if (!buyer_id || !item_id) {
            return response.status(400).json({ error: 'Both buyer_id and item_id are required' });
        }

        const solditem = await SoldItem.create({
            buyer_id,
            item_id
        });
        return response.json({
            status:'ok',
            solditem,
            message: "Solditem added successfully"
        })

    }
    catch(error){
        return response.send(error);
    }

})

// Get sold items for the current logged-in user
router.get('/getitems', verifyToken, async (request, response) => {
    try {
        // Retrieve the user ID from the request object
        const userId = request.userId;

        // Query the SoldItem collection for items sold to the current user
        const soldItems = await SoldItem.find({ buyer_id: userId });

        return response.json({
            status: 'ok',
            soldItems: soldItems,
            message: 'Sold items fetched successfully'
        });
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
});

export default router;