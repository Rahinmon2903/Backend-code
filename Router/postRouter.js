import mongoose from "mongoose"
import { ApprovePost, createPost, deletePost, getAllApprovedPost, getAllUnapprovedPost } from "../Controller/postController.js";
import { adminMiddleware, authMiddleware } from "../Middleware/middleware.js";
import express from "express"
import upload from "../Config/Multer.js";

const route=express.Router();

route.post("/create",authMiddleware,upload.single("image"),createPost)
route.get("/all",getAllApprovedPost)
route.get("/allunapproved",authMiddleware,adminMiddleware,getAllUnapprovedPost)
route.patch("/approve/:id",authMiddleware,adminMiddleware,ApprovePost)
route.delete("/delete/:id",authMiddleware,adminMiddleware,deletePost)

export default route;