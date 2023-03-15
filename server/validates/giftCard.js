import moment from "moment/moment.js";
import validate from "validate.js";
import {
	formatDateOnly,
	formatDateTime,
	GiFT_CARD_STATUS,
} from "../constants.js";
import GiftCard from "../models/GiftCard.js";
import Promotion from "../models/Promotion.js";
import sendError from "../utils/sendError.js";

export const validateGiftCard = async (req, res, next) => {
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

	validate.extend(validate.validators.datetime, {
		// The value is guaranteed not to be null or undefined but otherwise it
		// could be anything.
		parse: function (value) {
			return moment.utc(value, formatDateTime).valueOf();
		},
		// Input is a unix timestamp
		format: function (value, options) {
			const format = options.datetime ? formatDateTime : formatDateOnly;
			return moment.utc(value).format(format);
		},
	});

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
						promotion ? promotion : "Promotion id"
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

export const validateGiftCardWithId = async (req, res, next) => {
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

	validate.extend(validate.validators.datetime, {
		// The value is guaranteed not to be null or undefined but otherwise it
		// could be anything.
		parse: function (value) {
			return moment.utc(value, formatDateTime).valueOf();
		},
		// Input is a unix timestamp
		format: function (value, options) {
			const format = options.datetime ? formatDateTime : formatDateOnly;
			return moment.utc(value).format(format);
		},
	});

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
						promotion ? promotion : "Promotion id"
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