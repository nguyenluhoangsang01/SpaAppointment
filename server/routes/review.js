import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById,
} from "../controllers/review.js";
import verifyToken from "../middleware/verifyToken.js";
import { validateReview, validateReviewById } from "../validates/review.js";

// Config router
const router = express.Router();

// @route GET api/review
// @desc Get all reviews
// @access Private
router.get("/", verifyToken, getAll);

// @route GET api/review/:id
// @desc Get review by id
// @access Private
router.get("/:id", verifyToken, getById);

// @route POST api/review/:appointmentId
// @desc Create a new review
// @access Private
router.post("/:appointmentId", verifyToken, validateReview, create);

// @route PATCH api/review/:id
// @desc Update review by id
// @access Private
router.patch("/:id/:appointmentId", verifyToken, validateReviewById, updateById);

// @route DELETE api/review
// @desc Delete all reviews
// @access Private
router.delete("/", verifyToken, deleteAll);

// @route DELETE api/review/:id
// @desc Delete review by id
// @access Private
router.delete("/:id", verifyToken, deleteById);

export default router;