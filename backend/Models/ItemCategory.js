import mongoose from "mongoose";
 
const itemcategoryScehma = mongoose.model(
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