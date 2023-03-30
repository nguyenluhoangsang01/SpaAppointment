import express from "express";
import multer from "multer";
import { login, logout, register } from "../controllers/auth.js";
import verifyToken from "../middleware/verifyToken.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route POST api/auth/register
// @desc Create a new user
// @access Public
router.post("/register", upload.single("avatar"), register);

// @route POST api/auth/login
// @desc Login
// @access Public
router.post("/login", login);

// @route POST api/auth/logout
// @desc Logout
// @access Private
router.post("/logout", verifyToken, logout);

export default router;