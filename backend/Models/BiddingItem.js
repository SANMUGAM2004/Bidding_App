import mongoose from "mongoose";

const biddingitemSchema = new mongoose.Schema({
    item_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'PostItem', 
        required: true
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    bidding_amount : {
        type : Number,
        required : true
    },
    bidding_count : {
        type : Number,
        default : 0
    }
}, { 
    timestamps: true
});

export const BiddingItem = mongoose.model('BiddingItem', biddingitemSchema);
