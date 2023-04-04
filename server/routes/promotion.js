import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById,
} from "../controllers/promotion.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Config router
const router = express.Router();

// @route GET api/promotion
// @desc Get all promotions
// @access Public
router.get("/", getAll);

// @route GET api/promotion/:id
// @desc Get promotion by id
// @access Public
router.get("/:id", getById);

// @route POST api/promotion
// @desc Create a new promotion
// @access Private
router.post("/", verifyToken, verifyAdmin, create);

// @route PATCH api/promotion/:id
// @desc Update promotion by id
// @access Private
router.patch("/:id", verifyToken, verifyAdmin, updateById);

// @route DELETE api/promotion
// @desc Delete all promotions
// @access Private
router.delete("/", verifyToken, verifyAdmin, deleteAll);

// @route DELETE api/promotion/:id
// @desc Delete promotion by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteById);

export default router;