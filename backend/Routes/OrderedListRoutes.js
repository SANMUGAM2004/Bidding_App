import { OrderedList } from "../Models/OrderedList.js";
import express from "express";
import verifyToken from "../Middleware/Auth.js";

const router = express.Router();

// Create the route to add an item to the watchlist
router.post('/additem/:itemId', verifyToken, async (request, response) => {
    try {
        const userId = request.userId;
        const itemId = request.params.itemId;
        // Check if the item already exists in the ordered list for the user
        const existingItem = await OrderedList.findOne({ item_id: itemId, buyer_id: userId });
        if (existingItem) {
            return response.status(400).json({ status: 'error', message: 'Item already exists in ordered list' });
        }
        // Add the item to the ordered list
        const orderedListItem = await OrderedList.create({ item_id: itemId, buyer_id: userId });
        return response.status(200).json({ status: 'ok', orderedListItem, message: 'Item added to ordered list successfully' });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});

router.delete('/deleteitem/:itemId', verifyToken, async (request, response) => {
    try {
      const userId = request.userId; // Retrieve the user ID from the request
      const itemId = request.params.itemId; // Retrieve the item ID from the request parameters
  
      // Delete the item from the ordered list using both the user ID and item ID
      const result = await OrderedList.deleteOne({ buyer_id: userId, item_id: itemId });
  
      if (!result) {
        throw new Error("Item not found in the ordered list");
      }
  
      return response.json({ status: "ok", message: "Item deleted successfully" });
    } catch (error) {
      return response.status(500).json({ status: 'error', message: error.message });
    }
  });
  

//get item ffrom the ordered list
router.get('/getitems', verifyToken, async (request, response) => {
    try {
        console.log(request.body);
        const buyerId = request.userId; // Get the user ID from the token

        if (!buyerId) {
            throw new Error("User ID is not defined");
        }

        // Find all items in the ordered where buyer_id matches the logged-in user's ID
        const orderedlistItems = await OrderedList.find({ buyer_id: buyerId })

        return response.json({ status: 'ok', orderedlistItems });
    } catch (error) {
        return response.json({ status: 'error', message: error.message });
    }
});


export default router;