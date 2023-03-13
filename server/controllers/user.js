import { v2 as cloudinary } from "cloudinary";
import { avatarOptions } from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import bcrypt from "bcrypt";

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
	try {
		// Get user id from request
		const { userId } = req;

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
	const { email, password, phone } = req.body;
	// Get file from request
	const { file } = req;

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Compare password with old password
		const comparedPassword = bcrypt.compareSync(password, user.password);
		if (!comparedPassword)
			return sendError(
				res,
				"Sorry, the password you entered is incorrect. Please try again",
				400,
				"password"
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
							avatar: result.secure_url,
						},
						{ new: true }
					);
				});
		} else {
			await User.findByIdAndUpdate(userId, { ...req.body }, { new: true });
		}

		// Send success notification
		return sendSuccess(res, "Successfully edited personal profile");
	} catch (error) {
		next(error);
	}
};