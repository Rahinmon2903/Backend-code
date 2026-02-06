import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./database/dbConfig.js";
import userRouter from "./Router/userRouter.js";
import postRouter from "./Router/postRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).send("welcome to api");
});

app.use("/api/auth", userRouter);
app.use("/api/post", postRouter);

const startServer = async () => {
  try {
    await dbConnect(); 
    app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  } catch (error) {
    console.error("Server failed to start");
  }
};

startServer();
