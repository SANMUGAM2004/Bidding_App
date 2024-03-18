import mongoose from "mongoose";

const biddinghistorySchema =  new mongoose.Schema({
    item_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'PostItem'
    },
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    current_amount : {
        type : Number,
        required :true
    },
    timestamp: {
        type: Date,
        default: Date.now // Default to current timestamp
    }
})

export const BiddingHistory = mongoose.model('BiddingHistory',biddinghistorySchema);