import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

export const  conn = mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("DataBase connected")
})
.catch((err)=>{
    console.log("Database not connected",err)
})