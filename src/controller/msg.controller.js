import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { commonResponse } from "../utils/commonResponse.js";
import cloudinary from "../cloudinary/cloudinary.js"

export const getUser = async (req,res)=>{
    try {
        const loginUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loginUserId}}).select("-password");
        commonResponse(res,200,"All Users",filteredUsers);  
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}

export const getMsg = async (req,res)=>{
    try {
        const chatWithId = req.params.id;
        const myId = req.user._id;
        const msgs = await Message.find({
            $or:[
                {senderId:myId,reciverId:chatWithId},
                {senderId:chatWithId,reciverId:myId}
            ]
        })
        commonResponse(res,200,"All messages",msgs)
    } catch (error) {
        commonResponse(res,500,"Server error",null,error.message);
    }
}

export const sendMsg = async (req,res)=>{
    const {text,image} = req.body;
    try {
        const reciverId = req.params.id;
        const senderId = req.user._id;
        if(!text){
            return commonResponse(res,400,"You have to sent message")
        }
        trimText = text.trim();
        let imageUrl
        if(image){
            const imageResponse = await cloudinary.uploader.upload(image);
            imageUrl = imageResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            reciverId,
            text:trimText,
            image:imageUrl
        })
        // have to integrate socket.io for realtime chat

        await newMessage.save();
        commonResponse(res,201,"Message sent",newMessage);
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}