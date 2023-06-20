import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById,
} from "../controllers/schedule.js";
import verifyToken from "../middleware/verifyToken.js";

// Config router
const router = express.Router();

// @route GET api/schedule
// @desc Get all schedule
// @access Private
router.get("/", verifyToken, getAll);

// @route GET api/schedule/:id
// @desc Get schedule
// @access Private
router.get("/:id", verifyToken, getById);

// route POST api/schedule
// @desc Create a new schedule
// @access Private
router.post("/", verifyToken, create);

// @route PATCH api/schedule/:id
// @desc Update schedule by id
// @access Private
router.patch("/:id", verifyToken, updateById);

// @route DELETE api/schedule
// @desc Delete all schedule
// @access Private
router.delete("/", verifyToken, deleteAll);

// @route DELETE api/schedule/:id
// @desc Delete schedule by id
// @access Private
router.delete("/:id", verifyToken, deleteById);

export default router;