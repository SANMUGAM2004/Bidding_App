import mongoose from "mongoose";

const postitemSchema = new mongoose.Schema(
    {
        item_name : {
            type : String,
            required : true
        },
        seller_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        item_description : {
            type : String,
            required : true
        },
        item_quantity : {
            type : Number,
            required : true
        },
        item_amount : {
            type : Number,
            required : true
        },
        minimum_bidamount : {
            type : Number,
            required : true
        },
        // item_category : {
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : 'Category',
        //     required : true
        // },
        item_startdate : {
            type : Date,
            default : Date.now
        },
        item_enddate : {
            type : Date,
            required : true
        },
        item_image : {
            type : String,
        }

    }
)

export const PostItem = mongoose.model('PostItem',postitemSchema);