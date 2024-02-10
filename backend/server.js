import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { connectMongoDb } from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 6000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  connectMongoDb();
  console.log(`Server running on port ${port}`);
});
