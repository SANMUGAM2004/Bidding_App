import mongoose from "mongoose";

const watchcartSchema = mongoose.Schema(
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

export const WatchCart = mongoose.model('WatchCart',watchcartSchema);