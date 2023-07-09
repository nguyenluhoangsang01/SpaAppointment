import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Import routes
import appointmentRoutes from "./routes/appointment.js";
import authRoutes from "./routes/auth.js";
import giftCardRoutes from "./routes/giftCard.js";
import locationRoutes from "./routes/location.js";
import promotionRoutes from "./routes/promotion.js";
import scheduleRoutes from "./routes/schedule.js";
import serviceRoutes from "./routes/service.js";
import userRoutes from "./routes/user.js";

// Config dotenv
dotenv.config();

// Constants
const PORT = process.env.PORT;
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
app.use(cors());

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
		console.log("MongoDB connection is established successfully");
	})
	.catch((error) => {
		console.log(error.message);
	});

// Config server
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

// Routes
app.use("/api/appointment", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gift-card", giftCardRoutes);
app.use("/api/promotion", promotionRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/schedule", scheduleRoutes);

// Route not found
app.use("/*", (_req, res) => {
	res.status(501).send("Not implemented");
});