import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"already registered"]
    },
    username: {
        type:String,
        required:[true,"Give your full name"]
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:12,
        
    },
    image:{
        type:String,
        default:""
    }
},
{timestamps:true}
);

userSchema.pre("save", async function(next){
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
})

export default mongoose.model("User",userSchema);