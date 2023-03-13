import express from "express";
import multer from "multer";
import {
	changePassword,
	deleteAllUsers,
	deleteUserProfile,
	getAllUsers,
	getUserById,
	getUserProfile,
	updateUserProfile,
} from "../controllers/user.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
import { validateChangePassword, validateUser } from "../validates/user.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Private
router.get("/", verifyToken, verifyAdmin, getAllUsers);

// @route GET api/user/profile/:id
// @desc Get user by id
// @access Private
router.get("/profile/:id", verifyToken, getUserById);

// @route GET api/user/profile
// @desc Get user profile
// @access Private
router.get("/profile", verifyToken, getUserProfile);

// @route PATCH api/user/profile
// @desc Update user's profile
// @access Private
router.patch(
	"/profile",
	upload.single("avatar"),
	verifyToken,
	validateUser,
	updateUserProfile
);

// @route PATCH api/user/profile/change-password
// @desc Change password of current user
// @access Private
router.patch(
	"/profile/change-password",
	verifyToken,
	validateChangePassword,
	changePassword
);

// @route DELETE api/user
// @desc Delete all users
// @access Private
router.delete("/", verifyToken, verifyAdmin, deleteAllUsers);

// @route DELETE api/user/:id
// @desc Delete user by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteUserProfile);

export default router;