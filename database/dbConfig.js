import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "Bloggify",
    });

    console.log("Database connected:", conn.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); 
  }
};

export default dbConnect;
