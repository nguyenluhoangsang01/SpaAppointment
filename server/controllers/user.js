import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import validate from "validate.js";
import {
	avatarOptions,
	emailConstraint,
	newPasswordConstraint,
	phoneConstraint,
	roleConstraint,
} from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find().select("-__v -password");
		if (!users) return sendError(res, "User not found", 404);

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
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { address, firstName, lastName } = req.body;

	// Validate
	if (!firstName)
		return sendError(res, "First name can't be blank", 400, "firstName");
	if (!lastName)
		return sendError(res, "Last name can't be blank", 400, "lastName");
	if (!address) return sendError(res, "Address can't be blank", 400, "address");

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

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

		// Get user after updated
		const userUpdated = await User.findById(user._id).select("-__v -password");

		// Send success notification
		return sendSuccess(res, "Your profile has been edited successfully", {
			user: userUpdated,
		});
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get user id from request
	const { id } = req.params;
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { address, email, firstName, lastName, phone, role } = req.body;

	if (!firstName)
		return sendError(res, "First name can't be blank", 400, "firstName");
	if (!lastName)
		return sendError(res, "Last name can't be blank", 400, "lastName");
	if (!email) return sendError(res, "Email can't be blank", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email isn't a valid email", 400, "email");
	if (!phone)
		return sendError(res, "Phone number can't be blank", 400, "phone");
	if (validate({ phone }, phoneConstraint))
		return sendError(res, "Phone must be a valid phone number", 400, "phone");
	if (!role) return sendError(res, "Role can't be blank", 400, "role");
	if (validate({ role }, roleConstraint))
		return sendError(res, `${role} isn't included in the list`, 400, "role");
	if (!address) return sendError(res, "Address can't be blank", 400, "address");

	try {
		// Get user by id
		const user = await User.findById(id);
		if (!user) return sendError(res, "User not found", 404);

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
	const { confirmPassword, currentPassword, newPassword } = req.body;

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Compare current password
		const isMatchCurrentPassword = bcrypt.compareSync(
			currentPassword,
			user.password
		);

		if (!currentPassword)
			return sendError(
				res,
				"Current password can't be blank",
				400,
				"currentPassword"
			);
		if (!isMatchCurrentPassword)
			return sendError(
				res,
				"Current password you entered is incorrect",
				400,
				"currentPassword"
			);
		if (!newPassword)
			return sendError(res, "New password can't be blank", 400, "newPassword");
		if (validate({ newPassword }, newPasswordConstraint))
			return sendError(
				res,
				"New password should be at least 8 characters long and must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
				400,
				"newPassword"
			);
		const isMatchNewPassword = bcrypt.compareSync(newPassword, user.password);
		if (isMatchNewPassword)
			return sendError(
				res,
				"New password must be different from old password",
				400,
				"newPassword"
			);
		if (!confirmPassword)
			return sendError(
				res,
				"Confirm new password can't be blank",
				400,
				"confirmPassword"
			);
		if (confirmPassword !== newPassword)
			return sendError(
				res,
				"Confirm new password isn't equal to new password",
				400,
				"confirmPassword"
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

export const deleteAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find();
		if (!users) return sendError(res, "User not found", 404);

		// Delete all users
		await User.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all users successfully");
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