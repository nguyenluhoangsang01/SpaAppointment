import express from "express";
import {
	getAllUsers,
	getUserById,
	getUserProfile,
} from "../controllers/user.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

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

export default router;