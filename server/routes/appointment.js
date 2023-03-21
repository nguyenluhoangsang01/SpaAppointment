import express from "express";
import {
	create,
	deleteAll,
	deleteById,
	getAll,
	getById,
	updateById
} from "../controllers/appointment.js";
import verifyToken from "../middleware/verifyToken.js";
import {
	validateAppointment,
	validateAppointmentById
} from "../validates/appointment.js";

// Config router
const router = express.Router();

// @route GET api/appointment
// @desc Get all appointments
// @access Private
router.get("/", verifyToken, getAll);

// @route GET api/appointment/:id
// @desc Get appointment by id
// @access Private
router.get("/:id", verifyToken, getById);

// @route POST api/appointment
// @desc Create a new appointment
// @access Private
router.post("/", verifyToken, validateAppointment, create);

// @route PATCH api/appointment/:id
// @desc Update appointment by id
// @access Private
router.patch("/:id", verifyToken, validateAppointmentById, updateById);

// @route DELETE api/appointment
// @desc Delete all appointments
// @access Private
router.delete("/", verifyToken, deleteAll);

// @route DELETE api/appointment/:id
// @desc Delete appointment by id
// @access Private
router.delete("/:id", verifyToken, deleteById);

export default router;