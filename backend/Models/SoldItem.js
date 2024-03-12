import mongoose from "mongoose";

const solditemSchema = new mongoose.Schema(
    {
        bidding_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'BiddingItem',
            required: true
        }
    }
)

export const SoldItem = mongoose.model('SoldItem',solditemSchema);