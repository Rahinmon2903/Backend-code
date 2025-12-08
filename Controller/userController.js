import User from "../Model/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import sendEmail from "../Utils/mailer.js";


dotenv.config();

//register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: " error in registering user" });
    }
};


//login

export const loginUser = async (req, res) => {
    try {
       
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email" });
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ message: "invalid password" });
        } else {
            const token = jwt.sign(
                { _id: user._id },
                process.env.SECERT_KEY,
                { expiresIn: "1d" }
            );

            user.token = token;
            await user.save();
            res.status(200).json({ message: "User logged in successfully", token: token, role: user.role });
        }
    } catch (error) {
         console.error("LOGIN ERROR:", error);   
 
        res.status(500).json({ message: "Error in logging in user" });
    }
};

export const forgetpassword = async (req, res) => {
    try {
       
        const { email} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "invalid email" });
        }
        const token = jwt.sign(
            { _id: user._id },
            process.env.SECERT_KEY,
            { expiresIn: "1d" }
        );

        await sendEmail(
            user.email,
            "Reset Password",
            `http://localhost:5173/reset-password/${user._id}/${token}`
        )
       

            
            res.status(200).json({ message: "email sent" });
        }
     catch (error) {
          
 
        res.status(500).json({ message: "Error in reset password" });
    }
};


export const updatePassword=async (req,res) => {
    const {id,token} =req.params;
    const {password}=req.body;
    const user= await User.findById(id);
    if(!user){
        return res.status(400).json({message:"user not found"});
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECERT_KEY);
        if (!decodedToken) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatePassword=await User.findByIdAndUpdate(id,{password:hashedPassword},{new:true});

       

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in updating password" });

    }
    
}