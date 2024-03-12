import { SoldItem } from './models/SoldItem';
import { BiddingItem } from './models/BiddingItem';
import { PostItem } from './models/PostItem';
import { WatchCart } from './models/WatchCart';
import { OrderedList } from './models/OrderedList';

// Function to check for items whose end time has passed and mark them as sold
export const ItemSold = async () => {
    try {
        const currentDate = new Date();
        // Find items whose end time has passed
        const itemsToSell = await BiddingItem.find({ item_enddate: { $lt: currentDate } });
        // For each item, get the current buyer ID and mark it as sold
        for (const item of itemsToSell) {
            const currentBuyerId = item.current_buyer_id;
            // Create a new document in the SoldItem collection
            const soldItem = new SoldItem({ bidding_id: item._id });
            await soldItem.save();
            // Remove the sold item from the original collection
            await OrderedList.deleteOne({ item_id: item.item_id });
            // Delete the item from the PostItem collection
            await PostItem.deleteOne({ _id: item.item_id });
            // Delete the item from the WatchCart collection
            await WatchCart.deleteMany({ item_id: item.item_id });
            
        }

        console.log('Items sold successfully');
    } catch (error) {
        console.error('Error selling items:', error);
    }
};
