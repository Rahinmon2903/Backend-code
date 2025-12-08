import express from "express";
import { forgetpassword, loginUser, registerUser, updatePassword} from "../Controller/userController.js";


const userRouter=express.Router();


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/forgot-password",forgetpassword)
userRouter.post("/reset-password/:id/:token",updatePassword);


export default userRouter;