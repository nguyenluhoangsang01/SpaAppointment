import express from "express";
import multer from "multer";
import {
	changePassword,
	deleteAll,
	deleteById,
	getAll,
	getById,
	getProfile,
	updateById,
	updateProfile,
} from "../controllers/user.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
import {
	validateChangePassword,
	validateProfile,
	validateProfileById,
} from "../validates/user.js";

// Config multer
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Config router
const router = express.Router();

// @route GET api/user
// @desc Get all users
// @access Private
router.get("/", verifyToken, verifyAdmin, getAll);

// @route GET api/user/details/:id
// @desc Get user by id
// @access Private
router.get("/details/:id", verifyToken, getById);

// @route GET api/user/profile
// @desc Get user profile
// @access Private
router.get("/profile", verifyToken, getProfile);

// @route PATCH api/user/details/:id
// @desc Update user by id
// @access Private
router.patch(
	"/details/:id",
	upload.single("avatar"),
	verifyToken,
	verifyAdmin,
	validateProfileById,
	updateById
);

// @route PATCH api/user/profile
// @desc Update user's profile
// @access Private
router.patch(
	"/profile",
	upload.single("avatar"),
	verifyToken,
	validateProfile,
	updateProfile
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
router.delete("/", verifyToken, verifyAdmin, deleteAll);

// @route DELETE api/user/:id
// @desc Delete user by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteById);

export default router;