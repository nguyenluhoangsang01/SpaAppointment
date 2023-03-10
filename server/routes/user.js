import express from "express";
import {
	getAllUsers,
	getUserById,
	getUserProfile
} from "../controllers/user.js";

// Config router
const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Private
router.get("/", getAllUsers);

// @route GET api/user/:id
// @desc Get user by id
// @access Private
router.get("/:id", getUserById);

// @route GET api/user/profile
// @desc Get user profile
// @access Private
router.get("/profile", getUserProfile);

export default router;