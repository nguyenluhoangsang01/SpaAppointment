import bcrypt from "bcrypt";
import validate from "validate.js";
import { passwordRegex, phoneRegex, ROLES } from "../constants.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";


export const validateChangePassword = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { confirmPassword, currentPassword, newPassword } = req.body;

	// The properties to validate
	const attributes = {
		confirmPassword,
		currentPassword,
		newPassword,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		confirmPassword: {
			presence: { allowEmpty: false },
			equality: "newPassword",
		},
		currentPassword: {
			presence: { allowEmpty: false },
		},
		newPassword: {
			presence: { allowEmpty: false },
			length: {
				minimum: 8,
			},
			format: {
				pattern: passwordRegex,
				message:
					"must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
			},
		},
	};

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
			// Compare current password
			const isMatchCurrentPassword = bcrypt.compareSync(
				currentPassword,
				user.password
			);
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

			next();
		}
	} catch (error) {
		next(error);
	}
};