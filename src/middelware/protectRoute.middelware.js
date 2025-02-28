import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { commonResponse } from "../utils/commonResponse.js";

export const protectRoute = async (req,res,next)=>{
    const token = req.cookies.token;
    try {
        if(!token){
            return commonResponse(res,401,"Access denied - no token provided")
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return commonResponse(res,401,"Unauthorize - invalid token");
        }
        const foundUser = await User.findById(decoded.id).select("-password");
        if(!foundUser){
            return commonResponse(res,404,"Not Found");
        }
        req.user = foundUser;
        next();
    } catch (error) {
        commonResponse(res,500,"Server Error",null,error.message);
    }
}