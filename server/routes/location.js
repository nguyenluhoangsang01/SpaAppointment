import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getALl,
	getById,
	updateById,
} from "../controllers/location.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";

// Config router
const router = express.Router();

// @route GET api/location
// @desc Get all locations
// @access Private
router.get("/", verifyToken, verifyAdmin, getALl);

// @route GET api/location/:id
// @desc Get location
// @access Private
router.get("/:id", verifyToken, verifyAdmin, getById);

// route POST api/location
// @desc Create a new location
// @access Private
router.post("/", verifyToken, verifyAdmin, create);

// @route PATCH api/location/:id
// @desc Update location by id
// @access Private
router.patch("/:id", verifyToken, verifyAdmin, updateById);

// @route DELETE api/location
// @desc Delete all locations
// @access Private
router.delete("/", verifyToken, verifyAdmin, deleteAll);

// @route DELETE api/location/:id
// @desc Delete location by id
// @access Private
router.delete("/:id", verifyToken, verifyAdmin, deleteById);

export default router;