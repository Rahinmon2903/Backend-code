import dotenv from "dotenv";
import User from "../Model/userSchema.js";
import jwt from "jsonwebtoken";

dotenv.config();

export const authMiddleware = async (req, res, next) => {

    // 1st method:
    // The client sends a token in the "Authorization" header.
    // Here we read the entire value of that header (token or "Bearer <token>").
    

    // 2nd method (recommended when using "Bearer <token>" format)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(404).json({ message: "Token missing" });
    }

    try {
        // Verify the token using the secret key.
        // If valid, this returns the payload stored inside the token (including _id).
        const tokendecode = jwt.verify(token, process.env.SECRET_KEY);

        // Using the _id from the decoded token, find the user in the database.
        // .select("-password") removes the password field from the result.
        req.user = await User.findById(tokendecode._id).select("-password");

        // Move to the next middleware or route handler.
        next();

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const adminMiddleware = async (req, res, next) => {

    // 1st method:
    // The client sends a token in the "Authorization" header.
    // Here we read the entire value of that header (token or "Bearer <token>").
    

    // 2nd method (recommended when using "Bearer <token>" format)
  

 
    try {
        if(req.user.role  !== "admin"){
            return res.status(400).json({ message: "You are not an admin" });
        }
        next();
       
        
        
        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};