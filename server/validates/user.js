import validate from "validate.js";
import { passwordRegex, phoneRegex, ROLES } from "../constants.js";
import sendError from "../utils/sendError.js";

export const validateUser = (req, res, next) => {
	// Get data from request body
	const { address, email, firstName, lastName, currentPassword, phone, role } =
		req.body;

	// The properties to validate
	const attributes = {
		address,
		email,
		firstName,
		lastName,
		currentPassword,
		phone,
		role,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		address: {
			presence: true,
		},
		email: {
			presence: true,
			email: true,
		},
		firstName: {
			presence: true,
		},
		lastName: {
			presence: true,
		},
		currentPassword: {
			presence: true,
			length: {
				minimum: 8,
			},
		},
		phone: {
			presence: true,
			format: {
				pattern: phoneRegex,
				message: "must be a valid phone number",
			},
		},
		role: {
			inclusion: {
				within: ROLES,
			},
		},
	};

	// Find errors
	const errors = validate(attributes, constraints);

	// Check if errors occur
	if (errors) {
		return sendError(res, errors, 400, Object.keys(errors));
	} else {
		next();
	}
};

export const validateChangePassword = (req, res, next) => {
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
			presence: true,
			equality: "newPassword",
		},
		currentPassword: {
			presence: true,
		},
		newPassword: {
			presence: true,
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

	// Find errors
	const errors = validate(attributes, constraints);

	// Check if errors occur
	if (errors) {
		return sendError(res, errors, 400, Object.keys(errors));
	} else {
		next();
	}
};