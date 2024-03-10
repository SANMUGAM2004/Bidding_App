import express from 'express';
import { SoldItem } from '../Models/SoldItem.js';

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


export default router;