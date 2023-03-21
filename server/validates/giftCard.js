import validate from "validate.js";
import { GiFT_CARD_STATUS } from "../constants.js";
import GiftCard from "../models/GiftCard.js";
import Promotion from "../models/Promotion.js";
import sendError from "../utils/sendError.js";
import validateDatetime from "../utils/validateDateTime.js";

export const validateGiftCard = async (req, res, next) => {
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	// The properties to validate
	const attributes = { expirationDate, promotionId, status, value };

	// Check that the request body data meets the specified constraints
	const constraints = {
		expirationDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		promotionId: {
			presence: { allowEmpty: false },
		},
		status: {
			presence: { allowEmpty: false },
			inclusion: { within: GiFT_CARD_STATUS },
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
			// Get promotion by id
			const promotion = await Promotion.findById(promotionId);
			if (!promotion)
				return sendError(
					res,
					`${
						promotion ? promotion.name : "Promotion id"
					} is not included in the list`,
					404,
					"promotion"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};

export const validateGiftCardById = async (req, res, next) => {
	// Get gift card id from request params
	const { id } = req.params;
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	// The properties to validate
	const attributes = {
		expirationDate,
		promotionId,
		status,
		value,
	};

	// Check that the request body data meets the specified constraints
	const constraints = {
		expirationDate: {
			presence: { allowEmpty: false },
			datetime: true,
		},
		promotionId: {
			presence: { allowEmpty: false },
		},
		status: {
			presence: { allowEmpty: false },
			inclusion: { within: GiFT_CARD_STATUS },
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
		// Get gift card by id
		const giftCard = await GiftCard.findById(id);
		if (!giftCard) return sendError(res, "Gift card not found", 404);

		// Find errors
		const errors = validate(attributes, constraints);

		// Check if errors occur
		if (errors) {
			return sendError(res, errors, 400, Object.keys(errors));
		} else {
			// Get promotion by id
			const promotion = await Promotion.findById(promotionId);
			if (!promotion)
				return sendError(
					res,
					`${
						promotion ? promotion.name : "Promotion"
					} is not included in the list`,
					404,
					"promotion"
				);

			next();
		}
	} catch (error) {
		next(error);
	}
};