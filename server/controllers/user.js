import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAllUsers = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find().select("-__v -password");
		if (!users) return sendError(res, "No users found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving users successfully", users);
	} catch (error) {
		next(error);
	}
};

export const getUserById = async (req, res, next) => {
	try {
		// Get user id from request params
		const { id } = req.params;

		// Get user by id
		const user = await User.findById(id).select("-__v -password");
		if (!user) return sendError(res, "No user found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving user successfully", user);
	} catch (error) {
		next(error);
	}
};

export const getProfile = async (req, res, next) => {
	try {
		// Get user id from request
		const { userId } = req;

		// Get user by id
		const user = await User.findById(userId).select("-__v -password");
		if (!user) return sendError(res, "No user found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving user successfully", user);
	} catch (error) {
		next(error);
	}
};