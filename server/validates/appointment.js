import validate from "validate.js";
import sendError from "../utils/sendError.js";

export const validateAppointment = async (req, res, next) => {
	// Get data from request body
	const {} = req.body;

	// The properties to validate
	const attributes = {};

	// Check that the request body data meets the specified constraints
	const constraints = {};

	// Find errors
	const errors = validate(attributes, constraints);

	// Check if errors occur
	if (errors) {
		return sendError(res, errors, 400, Object.keys(errors));
	} else {
		next();
	}
};