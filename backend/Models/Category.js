import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
    {
        category_name : {
            type : String,
            required : true 
        }
    }
)

export const Category = mongoose.model('Category',categorySchema);