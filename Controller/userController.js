import User from "../Model/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config();

//register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password:hashedPassword  });
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: " error in registering user" });
    }
};


//login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "invalid email" });
        }
       const comparePassword=await bcrypt.compare(password,user.password)
       if(!comparePassword){
        return res.status(400).json({ error: "invalid password" });
       }else{
        const token = jwt.sign({ _id: user._id },process.env.SECERT_KEY);
        res.status(200).json({ message: "User logged in successfully", token });
       }
    } catch (error) {
        res.status(500).json({ error: "Error in logging in user" });
    }
};