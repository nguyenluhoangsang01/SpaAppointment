import validate from "validate.js";
import {
	ROLES,
	durationConstraint,
	endDateConstraint,
	startDateConstraint,
	statusAppointmentConstraint,
} from "../constants.js";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDateTime.js";

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
				path: "service",
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
				path: "service",
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
	const { duration, endDate, serviceId, staffId, startDate, status, title } =
		req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Service can't be blank", 400, "serviceId");
	if (!staffId) return sendError(res, "Staff can't be blank", 400, "staffId");
	if (!title) return sendError(res, "Title can't be blank", 400, "title");
	if (!duration && duration !== 0)
		return sendError(res, "Duration can't be blank", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Duration must be numeric and greater than 0",
			400,
			"duration"
		);
	if (!status) return sendError(res, "Status can't be blank", 400, "status");
	if (validate({ status }, statusAppointmentConstraint))
		return sendError(
			res,
			`${status} is not included in the list`,
			400,
			"status"
		);
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Staff isn't included in the list", 404, "staff");
		if (staff.role !== ROLES.Staff) return sendError(res, "User isn't a staff");

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(
				res,
				"Service isn't included in the list",
				404,
				"service"
			);

		const newAppointment = new Appointment({
			...req.body,
			service: serviceId,
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
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { duration, endDate, serviceId, staffId, startDate, status, title } =
		req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Service can't be blank", 400, "serviceId");
	if (!staffId) return sendError(res, "Staff can't be blank", 400, "staffId");
	if (!title) return sendError(res, "Title can't be blank", 400, "title");
	if (!duration && duration !== 0)
		return sendError(res, "Duration can't be blank", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Duration must be numeric and greater than 0",
			400,
			"duration"
		);
	if (!status) return sendError(res, "Status can't be blank", 400, "status");
	if (validate({ status }, statusAppointmentConstraint))
		return sendError(
			res,
			`${status} is not included in the list`,
			400,
			"status"
		);
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");

	try {
		// Get appointment by id
		const appointment = await Appointment.findById(id);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Staff isn't included in the list", 404, "staff");
		if (staff.role !== ROLES.Staff) return sendError(res, "User isn't a staff");

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(
				res,
				"Service isn't included in the list",
				404,
				"service"
			);

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
		if (!appointments) return sendError(res, "Appointment not found", 404);

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