import Appointment from "../models/Appointment.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all reviews
		const reviews = await Review.find().select("-__v");
		if (!reviews) return sendError(res, "Review not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving reviews successfully", reviews);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get service id from request params
	const { id } = req.params;

	try {
		// Get review by id
		const review = await Review.findById(id).select("-__v");
		if (!review) return sendError(res, "Review not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving review successfully", review);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get appointment id from request params
	const { appointmentId } = req.params;
	// Get user id from request
	const { userId } = req;

	try {
		const newReview = new Review({
			...req.body,
			appointment: appointmentId,
			user: userId,
		});
		await newReview.save();

		// Send success notification
		return sendSuccess(res, "Review created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get review id and appointment id from request params
	const { appointmentId, id } = req.params;
	// Get user id from request
	const { userId } = req;

	try {
		// Get user by id
		const user = await User.findById(userId);
		// Get appointment by id
		const appointment = await Appointment.findById(appointmentId);

		// Update review with new values
		await Review.findByIdAndUpdate(
			id,
			{
				...req.body,
				appointment: appointment._id,
				user: user._id,
			},
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Edited review successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all reviews
		const reviews = await Review.find().select("-__v");
		if (!reviews) return sendError(res, "Review not found", 404);

		// Delete all reviews
		await Review.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all reviews successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get review id from request params
	const { id } = req.params;

	try {
		// Get review by id
		const review = await Review.findByIdAndDelete(id);
		if (!review) return sendError(res, "Review not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete review successfully");
	} catch (error) {
		next(error);
	}
};