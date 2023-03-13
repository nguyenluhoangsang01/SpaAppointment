import validate from "validate.js";
import { passwordRegex, phoneRegex, ROLES } from "../constants.js";
import sendError from "../utils/sendError.js";

export const validateAuth = (req, res, next) => {
	// Get data from request body
	const {
		address,
		confirmPassword,
		email,
		firstName,
		lastName,
		password,
		phone,
		role,
	} = req.body;

	// The properties to validate
	const attributes = {
		address,
		confirmPassword,
		email,
		firstName,
		lastName,
		password,
		phone,
		role,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		address: {
			presence: { allowEmpty: false },
		},
		confirmPassword: {
			presence: { allowEmpty: false },
			equality: "password",
		},
		email: {
			presence: { allowEmpty: false },
			email: true,
		},
		firstName: {
			presence: { allowEmpty: false },
		},
		lastName: {
			presence: { allowEmpty: false },
		},
		password: {
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
		phone: {
			presence: { allowEmpty: false },
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