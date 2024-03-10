import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        user_name: {
            type : String,
            required : true
        },
        user_age : {
            type : Number,
            required : true
        },
        user_email : {
            type : String,
            required : true
        },
        user_phonenumber : {
            type : Number,
            required : true
        },
        user_address : {
            type : String,
            required : true
        },
        user_password : {
            type : String,
            required : true
        },
        
    }
)

export const User = mongoose.model('User',userSchema);