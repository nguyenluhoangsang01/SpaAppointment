import express from "express";
import multer from "multer";
import {
	getAllUsers,
	getUserById,
	getUserProfile,
	updateUserProfile,
} from "../controllers/user.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
import { validateAuth } from "../validates/auth.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Private
router.get("/", verifyToken, verifyAdmin, getAllUsers);

// @route GET api/user/:id
// @desc Get user by id
// @access Private
router.get("/:id", verifyToken, getUserById);

// @route GET api/user/profile
// @desc Get user profile
// @access Private
router.get("/profile", verifyToken, getUserProfile);

// @route PATCH api/user/profile
// @desc Update profile of user
// @access Private
router.patch(
	"/profile",
	upload.single("avatar"),
	verifyToken,
	validateAuth,
	updateUserProfile
);

export default router;