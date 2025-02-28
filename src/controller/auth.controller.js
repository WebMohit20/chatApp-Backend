import User from "../models/user.model.js";
import { commonResponse } from "../utils/commonResponse.js";
import { generateToken } from "../utils/jwt.js";
import { passwordChecker } from "../utils/passwordChecker.js";
import cloudinary from "../cloudinary/cloudinary.js";


export const signup = async (req,res)=>{
    let {username,email,password} = req.body;
    
    try {
        if(!email||!username||!password){
            return commonResponse(res,400,"All fields must have data")
        }
        username = username.trim()
        email = email.trim()
        if(password.length<6){
            return commonResponse(res,400,"Too Short Password");
        }
        const user = await User.findOne({email}).select("-password");
        if(user){
            return commonResponse(res,400,"Already Registered",user);
        }
        const newUser = new User({
            username,
            email,
            password
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save()
            commonResponse(res,201,"Success",newUser);
        }
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}

export const login = async (req,res)=>{
    let {email,password} = req.body;
    try {
        if(!email||!password){
            return commonResponse(res,400,"Fill out all the details");
        }
        email = email.trim();
        const user = await User.findOne({email});
        if(!user){
            return commonResponse(res,400,"Invalid Credentials");
        }
        const isValidPassword = await passwordChecker(password,user.password);
        
        if(!isValidPassword){
            return commonResponse(res,400,"Invalid Credentials");
        }
        generateToken(user._id,res);
        commonResponse(res,200,"Success fully login",user);
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message)
    }
}

export const logout =  (req,res)=>{
    try {
        res.clearCookie('token', { httpOnly: true, secure: true });
        commonResponse(res,200,"Logout Successfully");
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}

export const updateProfile = async (req,res)=>{
    const { image } = req.body;
    try {
        const userId = req.user._id;
        if(!image){
            return commonResponse(res,400,"Image isrequired");
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        const updateUser = await User.findByIdAndUpdate(userId,{image:uploadResponse.secure_url},{new:true})
        commonResponse(res,201,"Uploaded Succesfully",updateUser)
    } catch (error) {
        return commonResponse(res,500,"Server Error",null,error.message);
    }
}

export const checkAuth = (req,res)=>{
    
    try {
        const {user} = req;
        commonResponse(res,200,"Successfully Authenticated",user);
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}