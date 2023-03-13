import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { avatarOptions } from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAllUsers = async (req, res, next) => {
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

export const getUserById = async (req, res, next) => {
	try {
		// Get user id from request params
		const { id } = req.params;

		// Get user by id
		const user = await User.findById(id).select("-__v -password");
		if (!user) return sendError(res, "User not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving user successfully", user);
	} catch (error) {
		next(error);
	}
};

export const getUserProfile = async (req, res, next) => {
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

export const updateUserProfile = async (req, res, next) => {
	// Get user if from request
	const { userId } = req;
	// Get data from request body
	const { email, currentPassword, phone } = req.body;
	// Get file from request
	const { file } = req;

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Compare password with current password
		const comparedPassword = bcrypt.compareSync(currentPassword, user.password);
		if (!comparedPassword)
			return sendError(
				res,
				"Sorry, the password you entered is incorrect. Please try again",
				400,
				"currentPassword"
			);

		// Check email exists or not in database
		const isEmailExists = await User.findOne({
			email: { $eq: email, $ne: user.email },
		});
		if (isEmailExists)
			return sendError(
				res,
				`User with this email (${isEmailExists.email}) already exists`,
				409,
				"email"
			);
		// Check phone exists or not in database
		const isPhoneExists = await User.findOne({
			phone: { $eq: phone, $ne: user.phone },
		});
		if (isPhoneExists)
			return sendError(
				res,
				`User with this phone number (${isPhoneExists.phone}) already exists`,
				409,
				"phone"
			);

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
		return sendSuccess(res, "Successfully edited personal profile");
	} catch (error) {
		next(error);
	}
};

export const changePassword = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { currentPassword, newPassword } = req.body;

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Compare current password
		const isMatchCurrentPassword = bcrypt.compareSync(
			currentPassword,
			user.password
		);
		// Check if the password entered by the user does not match the password in the database
		if (!isMatchCurrentPassword)
			return sendError(
				res,
				"Sorry, the current password you entered is incorrect. Please try again",
				400,
				"currentPassword"
			);

		// Compare new password
		const isMatchNewPassword = bcrypt.compareSync(newPassword, user.password);
		if (isMatchNewPassword)
			return sendError(
				res,
				"The new password must be different from the old password",
				400,
				"newPassword"
			);

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

export const deleteAllUsers = async (req, res, next) => {
	try {
		await User.deleteMany();

		return sendError(res, "Delete all users successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteUserProfile = async (req, res, next) => {
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

		return sendSuccess(res, "Delete user successfully");
	} catch (error) {
		next(error);
	}
};