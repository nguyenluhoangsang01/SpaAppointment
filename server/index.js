import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/auth.js";

// Config dotenv
dotenv.config();

// Constants
const HOST = process.env.HOST;
const API_BASE_ENDPOINT_CLIENT = process.env.API_BASE_ENDPOINT_CLIENT;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Config app
const app = express();

// Config middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin:
      NODE_ENV === "dev"
        ? API_BASE_ENDPOINT_CLIENT
        : [`http://${HOST}`, `https://${HOST}`],
    credentials: true,
  })
);

// Config cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Config mongoose
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

// Config server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Routes
app.use("/api/auth", authRoutes);

// Route not found
app.use("/*", (_req, res) => {
  res.status(501).send("Not implemented");
});