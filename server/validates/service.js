import validate from "validate.js";
import sendError from "../utils/sendError.js";

export const validateService = (req, res, next) => {
	// Get data from request body
	const { description, duration, name, price } = req.body;

	// The properties to validate
	const attributes = {
		description,
		duration,
		name,
		price,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		description: {
			presence: { allowEmpty: false },
		},
		duration: {
			presence: { allowEmpty: false },
			numericality: {
				onlyInteger: false,
				greaterThan: 0,
			},
		},
		name: {
			presence: { allowEmpty: false },
		},
		price: {
			presence: { allowEmpty: false },
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 0,
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