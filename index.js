import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./database/dbConfig.js";
import userRouter from "./Router/userRouter.js";


dotenv.config();

const app=express();

app.use(express.json());
app.use(cors());
dbConnect();

const port=process.env.PORT

app.get("/",(req,res)=>{
    res.status(200).send("welcome to api")
})
app.use("/api/auth",userRouter)



app.listen(port,()=>{
    console.log("server started");
    
})