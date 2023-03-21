import validate from "validate.js";
import { APPOINTMENT_STATUS, ROLES } from "../constants.js";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import validateDatetime from "../utils/validateDateTime.js";

export const validateAppointment = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { datetime, duration, serviceId, staffId, status, title } = req.body;

	// The properties to validate
	const attributes = { datetime, duration, serviceId, staffId, status, title };

	// Check that the request body data meets the specified constraints
	const constraints = {
		datetime: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		duration: {
			presence: { allowEmpty: false },
			numericality: {
				greaterThanOrEqualTo: 0,
			},
		},
		serviceId: {
			presence: { allowEmpty: false },
		},
		staffId: {
			presence: { allowEmpty: false },
		},
		status: {
			presence: { allowEmpty: false },
			inclusion: { within: APPOINTMENT_STATUS },
		},
		title: {
			presence: { allowEmpty: false },
		},
	};

	validateDatetime();

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			// Get staff by id
			const staff = await User.findById(staffId);
			if (!staff)
				return sendError(
					res,
					"Staff is not included in the list",
					404,
					"staff"
				);
			if (staff.role !== ROLES.Staff)
				return sendError(res, "User is not a staff");

			// Get service by id
			const service = await Service.findById(serviceId);
			if (!service)
				return sendError(
					res,
					"Service is not included in the list",
					404,
					"service"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};

export const validateAppointmentById = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get appointment id from request params
	const { id } = req.params;
	// Get data from request body
	const { datetime, duration, serviceId, staffId, status, title } = req.body;

	// The properties to validate
	const attributes = { datetime, duration, serviceId, staffId, status, title };

	// Check that the request body data meets the specified constraints
	const constraints = {
		datetime: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		duration: {
			presence: { allowEmpty: false },
			numericality: {
				greaterThanOrEqualTo: 0,
			},
		},
		serviceId: {
			presence: { allowEmpty: false },
		},
		staffId: {
			presence: { allowEmpty: false },
		},
		status: {
			presence: { allowEmpty: false },
			inclusion: { within: APPOINTMENT_STATUS },
		},
		title: {
			presence: { allowEmpty: false },
		},
	};

	validateDatetime();

	try {
		// Get appointment by id
		const appointment = await Appointment.findById(id);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			// Get staff by id
			const staff = await User.findById(staffId);
			if (!staff)
				return sendError(
					res,
					"Staff is not included in the list",
					404,
					"staff"
				);
			if (staff.role !== ROLES.Staff)
				return sendError(res, "User is not a staff");

			// Get service by id
			const service = await Service.findById(serviceId);
			if (!service)
				return sendError(
					res,
					"Service is not included in the list",
					404,
					"service"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};