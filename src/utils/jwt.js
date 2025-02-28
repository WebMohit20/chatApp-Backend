import jwt from "jsonwebtoken"

export  function generateToken(id,res){
    const token =  jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"30d"
    });

    res.cookie("token",token,{
        maxAge:30*24*60*60*1000,
        httpOnly:true, // prevent Xss attack
        sameSite:"strict", //CSRF attacks cross-site request forgery attack
        secure:process.env.NODE_ENV !== "development"
    })
    return token;
}