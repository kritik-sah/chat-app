import mongoose from "mongoose";

export const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Failed to connect Mongodb - Error : ", error);
  }
};
