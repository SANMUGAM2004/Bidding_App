import express from "express";
import { PORT,mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import DBConnect from './Database/DBConnection.js';
import userrouter from "./Routes/UserRoutes.js";
import postitemrouter from "./Routes/PostItemRoutes.js";
import categoryrouter from "./Routes/CategoryRoutes.js";
import solditemrouter from "./Routes/SoldItemRoutes.js";
import biddingrouter from "./Routes/BiddingItemRoutes.js"
import watchcartrouter from "./Routes/WatchCartRoutes.js"
import cors from "cors";
import morgan from 'morgan'


const app = express();
app.use(express.json())

app.use(morgan())

// Enable CORS
app.use(cors({
    allowOrigin:'*'
}));
//connect with DB
DBConnect();

//user based operation.
app.use('/user',userrouter);

app.use('/item',postitemrouter);

app.use('/category', categoryrouter);

app.use('/solditem', solditemrouter);

app.use('/biditem', biddingrouter);

//app.use('/bid', biddingrouter);

app.use('/cart' , watchcartrouter);

app.get('/', (request,response) => {
    response.status(200).send("Successfully worked");
});



app.listen(PORT,() => {
    console.log(`Welome:${PORT}`);
});

