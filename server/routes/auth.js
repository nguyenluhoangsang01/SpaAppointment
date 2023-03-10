import express from "express";
import multer from "multer";
import { login, refreshToken, register } from "../controllers/auth.js";
import { validateAuth } from "../validates/auth.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route POST api/auth/register
// @desc Create a new user
// @access Public
router.post("/register", upload.single("avatar"), validateAuth, register);

// @route POST api/auth/login
// @desc Login
// @access Public
router.post("/login", login);

// @route POST api/auth/refresh-token
// @desc Refresh new access token
// @access Private
router.post("/refresh-token", refreshToken);

export default router;