import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Dotenv config
dotenv.config();

// Constants
const HOST = process.env.HOST;
const API_BASE_ENDPOINT_CLIENT = process.env.API_BASE_ENDPOINT_CLIENT;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

// Config app
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin:
      NODE_ENV === "dev"
        ? API_BASE_ENDPOINT_CLIENT
        : [`http://${HOST}`, `https://${HOST}`],
    credentials: true,
  })
);

// Set up mongoose connect
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

// Server running on port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

// Routes

// Route not found
app.use("/*", (_, res) => {
  res.status(501).send("Not implemented");
});
