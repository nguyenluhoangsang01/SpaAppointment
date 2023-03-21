import Appointment from "../models/Appointment.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all appointments
		const appointments = await Appointment.find()
			.populate({
				path: "user",
				select: "-__v -password",
			})
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.populate({
				path: "services",
				select: "-__v",
			})
			.select("-__v");
		if (!appointments) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(
			res,
			"Retrieving appointments successfully",
			appointments
		);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get appointment by id
	const { id } = req.params;

	try {
		// Get appointment by id
		const appointment = await Appointment.findById(id)
			.populate({
				path: "user",
				select: "-__v -password",
			})
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.populate({
				path: "services",
				select: "-__v",
			})
			.select("-__v");
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving appointment successfully", appointment);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { serviceId, staffId } = req.body;

	try {
		const newAppointment = new Appointment({
			...req.body,
			services: serviceId,
			staff: staffId,
			user: userId,
		});
		await newAppointment.save();

		// Sen success notification
		return sendSuccess(res, "Appointment created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get appointment id from request params
	const { id } = req.params;
	// Get data from request body
	const { serviceId, staffId } = req.body;

	try {
		await Appointment.findByIdAndUpdate(
			id,
			{ ...req.body, services: serviceId, staff: staffId },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Edited appointment successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all appointments
		const appointments = await Appointment.find();
		if (appointments.length < 0)
			return sendError(res, "Appointment not found", 404);

		// Delete all appointments
		await Appointment.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all appointments successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get appointment id from request params
	const { id } = req.params;

	try {
		// Get appointment by id
		const appointment = await Appointment.findByIdAndDelete(id);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete appointment successfully");
	} catch (error) {
		next(error);
	}
};