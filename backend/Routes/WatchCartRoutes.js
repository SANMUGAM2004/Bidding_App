import { WatchCart } from "../Models/WatchCart.js";
import express from "express";
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();

//Create a Watchcart item.
router.post('/additem/:itemId', verifyToken , async(request,response) =>{
    try{
        const itemId = request.params.itemId;
        const buyerId = request.userId;

        if(!itemId){
            throw new Error("item Id is not defined");
        }
        if(!buyerId){
            throw new Error("Buyer id is not defined");
        }

        const watchcart = await WatchCart.create({
            item_id : itemId,
            buyer_id : buyerId
        })
        return response.json({status:'succes',watchcart});

    }
    catch(error){
        return response.json({status:'error' , error:error.message});
    }
})

//Remove from watchcart
router.delete('/deleteitem/:itemId', verifyToken, async (request,response) => {
    try{
        const itemId = request.itemId;
        // Delete the bidding item by item_id
        const result = await BiddingItem.deleteOne({ item_id: itemId });

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