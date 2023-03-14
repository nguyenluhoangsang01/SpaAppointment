import { v2 as cloudinary } from "cloudinary";
import { avatarOptions } from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find().select("-__v -password");
		if (!users) return sendError(res, "Users not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving users successfully", users);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get user id from request params
	const { id } = req.params;

	try {
		// Get user by id
		const user = await User.findById(id).select("-__v -password");
		if (!user) return sendError(res, "User not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving user successfully", user);
	} catch (error) {
		next(error);
	}
};

export const getProfile = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;

	try {
		// Get user by id
		const user = await User.findById(userId).select("-__v -password");
		if (!user) return sendError(res, "User not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving user successfully", user);
	} catch (error) {
		next(error);
	}
};

export const updateProfile = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { email, currentPassword, phone } = req.body;
	// Get file from request
	const { file } = req;

	try {
		// Get user by id
		const user = await User.findById(userId);

		// Check file exist or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, avatarOptions)
				.then(async (result) => {
					await User.findByIdAndUpdate(
						userId,
						{
							...req.body,
							password: user.password,
							avatar: result.secure_url,
						},
						{ new: true }
					);
				});
		} else {
			await User.findByIdAndUpdate(
				userId,
				{ ...req.body, password: user.password },
				{ new: true }
			);
		}

		// Send success notification
		return sendSuccess(res, "Your profile has been edited successfully");
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get user id from request
	const { id } = req.params;
	// Get file from request
	const { file } = req;

	try {
		// Get user by id
		const user = await User.findById(id);

		// Check file exist or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, avatarOptions)
				.then(async (result) => {
					await User.findByIdAndUpdate(
						id,
						{
							...req.body,
							password: user.password,
							avatar: result.secure_url,
						},
						{ new: true }
					);
				});
		} else {
			await User.findByIdAndUpdate(
				id,
				{ ...req.body, password: user.password },
				{ new: true }
			);
		}

		// Send success notification
		return sendSuccess(res, "Edited user successfully");
	} catch (error) {
		next(error);
	}
};

export const changePassword = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { newPassword } = req.body;

	try {
		// Hash new password
		const hashedNewPassword = await hashPassword(newPassword);

		// Update user with new hashed password
		await User.findByIdAndUpdate(
			userId,
			{ password: hashedNewPassword },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Your password has been changed");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find();
		if (!users) return sendError(res, "Users not found", 404);

		// Delete all users
		await User.deleteMany();

		// Send success notification
		return sendError(res, "Delete all users successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get user id from request params
	const { id } = req.params;
	// Get user id from request
	const { userId } = req;

	// Check if 2 IDs are the same
	if (id === userId) return sendError(res, "Can't delete current user");

	try {
		// Get user by id
		const user = await User.findByIdAndDelete(id);
		if (!user) return sendError(res, "User not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete user successfully");
	} catch (error) {
		next(error);
	}
};