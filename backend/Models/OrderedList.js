import mongoose from "mongoose";

const orderedlistSchema = new mongoose.Schema(
    {
        item_id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'PostItem', 
            required: true
        },
        buyer_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }
    }
)

export const OrderedList = mongoose.model('OrderedList',orderedlistSchema);