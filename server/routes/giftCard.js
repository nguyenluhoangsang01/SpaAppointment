import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById,
} from "../controllers/giftCard.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Config router
const router = express.Router();

// @route GET api/gift-card
// @desc Get all gift cards
// @access Public
router.get("/", getAll);

// @route GET api/gift-card/:id
// @desc Get gift card by id
// @access Public
router.get("/:id", getById);

// @route POST api/gift-card
// @desc Create a new gift card
// @access Private
router.post("/", verifyToken, verifyAdmin, create);

// @route PATCH api/gift-card/:id
// @desc Update gift card by id
// @access Private
router.patch("/:id", verifyToken, verifyAdmin, updateById);

// @route DELETE api/gift-card
// @desc Delete all gift cards
// @access Private
router.delete("/", verifyToken, verifyAdmin, deleteAll);

// @route DELETE api/gift-card/:id
// @desc Delete gift card by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteById);

export default router;