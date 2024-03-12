import mongoose from "mongoose";
 
const itemcategoryScehma = new mongoose.Schema(
    {
        item_id : {
            type : String ,
            required : true
        },
        category_id : {
            type : String,
            required : true
        }
    }
)
export const ItemCategory = mongoose.model('ItemCategory', itemcategoryScehma);