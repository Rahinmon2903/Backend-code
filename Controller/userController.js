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
                process.env.SECRET_KEY,
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
    const { email } = req.body;

    // 1️⃣ Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const resetLink = `http://localhost:5173/reset-password/${user._id}/${token}`;

    // 4️⃣ Send email
    await sendEmail(
      user.email,
      "Reset Password",
      resetLink
    );

    res.status(200).json({ message: "Reset email sent" });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
