import { User } from "../Models/User.js";
import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyToken from "../Middleware/Auth.js";
import { PostItem } from "../Models/PostItem.js";


const router = express.Router()

//Create a new User.
router.post('/signup', async (request,response) =>{
    console.log(request.body);
    try{
        const {user_name , user_age , user_email,user_phonenumber,user_address,user_password} = request.body
        //Validate your password and Email here.
        if(!validator.isEmail(user_email)){
            throw new Error("Invalid Email id");
        }
        if(!validator.isStrongPassword(user_password)){
            throw new Error("Password is not Strong");
        }


        //Check is there any existing email or user name;
        const existingemail = await User.findOne({user_email});
        const existinguser = await User.findOne({user_name});
        if(existingemail){
            throw new Error("This Email id is already exist");
        }
        if(existinguser){
            throw new Error("The username is already exist");
        }

        //This following code is used for Hash your password.
        const hashpassword = await bcrypt.hash(user_password,10);


        const user = await User.create({
            user_name,
            user_age,
            user_email,
            user_phonenumber,
            user_address,
            user_password : hashpassword
        })
        return response.json({status:'ok',data:request.body, message: 'Signup successfull'});
    }
    catch(error){
        return response.json({status:'error', error:error.message});
    }

})

//Create a login for user
router.post('/login',async(request,response) =>{
    try{
        const {user_email, user_password} = request.body;
        const user = await User.findOne({user_email});

        //Valid the email id.
        if(!validator.isEmail(user_email)){
            throw new Error("Invalid Email id");
        }
        if(!user){
            throw new Error("Email Id is not Found");
        }

        const passwordmatch = await bcrypt.compare(user_password,user.user_password);

        if(passwordmatch){
            const token = jwt.sign({
                userId : user._id,
            },'privatesecretkey123',{expiresIn:'1h'})
            return response.json({status:'ok',token : token, message:"login success"});
        }
        else{
            return response.json({
                status:'error',user:false , message: 'Password is wrong'
            })
        }

    }
    catch(error){
        return response.json({status:'error', message : error.message});
    }
});

//Update the user.
router.put('/update', verifyToken, async (request,response) => {
    try{
        const userId = request.userId;
        const updateField = request.body;

        const updatedUser =  await User.findByIdAndUpdate(userId, updateField , {new:true});

        return response.status(200).json({message:"User Updated", updatedUser});
    }
    catch(error){
        return response.status(400).json({error:error.message});
    }
})

//Delete user for DB
router.delete('/delete', verifyToken, async (request,response) => {
    try{
        const userId = request.userId;
        const deletedUser = await User.findByIdAndDelete(userId);

        if(!deletedUser){
            return response.send({message : "User not already deleted"});
        }

        return response.status(200).json({message:"User Deleted"});
    }
    catch(error){
        return response.status(400).json({error:error.message});
    }
})

// Get all post items posted by the logged-in user
router.get('/myposts', verifyToken, async (request, response) => {
    try {
        const userId = request.userId;

        // Find all post items where the seller_id matches the logged-in user's ID
        const userPostItems = await PostItem.find({ seller_id: userId });

        // Check if the user has posted any items
        if (!userPostItems || userPostItems.length === 0) {
            return response.status(404).json({ status: 'error', message: 'No post items found for the logged-in user' });
        }
        return response.status(200).json({ status: 'ok', postItems: userPostItems });
    } catch (error) {
        return response.status(500).json({ status: 'error', error: error.message });
    }
});

//Get seller details by id
router.get('/get/:sellerId', async (request,response) => {
    console.log(request.params.sellerId);
    try{
        const sellerId = request.params.sellerId;
        console.log(sellerId);
        const sellerDetails = await User.findById(sellerId);
        return response.status(200).json({ status: 'ok', sellerDetails });
    }
    catch(error){
        return response.json({ status : 'error', error: error.message});
    }
})


export default router;