import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import  "./db/db.js"
import authRoutes from "./routes/auth.route.js"
import msgRoutes from "./routes/msg.route.js"

dotenv.config() 
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth",authRoutes);

app.use("/api/msg",msgRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})