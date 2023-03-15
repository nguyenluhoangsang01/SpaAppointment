import validate from "validate.js";
import { PROMOTION_TYPE } from "../constants.js";
import Promotion from "../models/Promotion.js";
import sendError from "../utils/sendError.js";
import validateDatetime from "../utils/validateDateTime.js";

export const validatePromotion = async (req, res, next) => {
	// Get data from request body
	const {
		description,
		endDate,
		maxUses,
		name,
		service,
		startDate,
		type,
		value,
	} = req.body;

	// The properties to validate
	const attributes = {
		description,
		endDate,
		maxUses,
		name,
		service,
		startDate,
		type,
		value,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		description: {
			presence: { allowEmpty: false },
		},
		endDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		maxUses: {
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 1,
			},
		},
		name: {
			presence: { allowEmpty: false },
		},
		service: {
			presence: { allowEmpty: false },
		},
		startDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		type: {
			inclusion: {
				within: PROMOTION_TYPE,
			},
		},
		value: {
			presence: { allowEmpty: false },
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 0,
			},
		},
	};

	validateDatetime();

	try {
		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			// Check name exists or not in database
			const isNameExists = await Promotion.findOne({ name });
			if (isNameExists)
				return sendError(
					res,
					`Promotion with this name (${isNameExists.name}) already exists`,
					409,
					"name"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};

export const validatePromotionById = async (req, res, next) => {
	// Get promotion id from request params
	const { id } = req.params;
	// Get data from request body
	const {
		description,
		endDate,
		maxUses,
		name,
		service,
		startDate,
		type,
		value,
	} = req.body;

	// The properties to validate
	const attributes = {
		description,
		endDate,
		maxUses,
		name,
		service,
		startDate,
		type,
		value,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		description: {
			presence: { allowEmpty: false },
		},
		endDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		maxUses: {
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 1,
			},
		},
		name: {
			presence: { allowEmpty: false },
		},
		service: {
			presence: { allowEmpty: false },
		},
		startDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		type: {
			inclusion: {
				within: PROMOTION_TYPE,
			},
		},
		value: {
			presence: { allowEmpty: false },
			numericality: {
				onlyInteger: true,
				greaterThanOrEqualTo: 0,
			},
		},
	};

	validateDatetime();

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(id);
		if (!promotion) return sendError(res, "Promotion not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			// Check name exists or not in database
			const isNameExists = await Promotion.findOne({
				name: { $eq: name, $ne: promotion.name },
			});
			if (isNameExists)
				return sendError(
					res,
					`Promotion with this name (${isNameExists.name}) already exists`,
					409,
					"name"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};