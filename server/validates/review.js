import validate from "validate.js";
import { RATES } from "../constants.js";
import Appointment from "../models/Appointment.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";

export const validateReview = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get appointment id from request params
	const { appointmentId } = req.params;
	// Get data from request body
	const { comment, rating } = req.body;

	// The properties to validate
	const attributes = { comment, rating };

	// Check that the request body data meets the specified constraints
	const constraints = {
		comment: {
			presence: { allowEmpty: false },
		},
		rating: {
			presence: { allowEmpty: false },
			inclusion: { within: RATES },
			numericality: true,
		},
	};

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get appointment by id
		const appointment = await Appointment.findById(appointmentId);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}
};

export const validateReviewWithId = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { comment, rating } = req.body;
	// Get review id and appointment id from request params
	const { appointmentId, id } = req.params;

	// The properties to validate
	const attributes = { comment, rating };

	// Check that the request body data meets the specified constraints
	const constraints = {
		comment: {
			presence: { allowEmpty: false },
		},
		rating: {
			presence: { allowEmpty: false },
			inclusion: { within: RATES },
			numericality: true,
		},
	};

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get appointment id
		const appointment = await Appointment.findById(appointmentId);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Get review by id
		const review = await Review.findById(id);
		if (!review) return sendError(res, "Review not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}
};