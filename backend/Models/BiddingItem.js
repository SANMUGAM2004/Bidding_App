import mongoose from "mongoose";

const biddingitemSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    item_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PostItem', 
        required: true
    },
    current_amount : {
        type : Number,
        default : 0
    },
    bidding_count : {
        type : Number,
        default : 0
    }
}, { 
    timestamps: true
});

export const BiddingItem = mongoose.model('BiddingItem', biddingitemSchema);
