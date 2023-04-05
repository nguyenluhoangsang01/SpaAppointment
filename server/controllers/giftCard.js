import {
	expirationDateConstraint,
	statusConstraint,
	valueConstraint,
} from "../constants.js";
import GiftCard from "../models/GiftCard.js";
import Promotion from "../models/Promotion.js";
import generateRandomCode from "../utils/generateRandomCode.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDateTime.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all gift cards
		const giftCards = await GiftCard.find()
			.populate({
				path: "promotion",
				select: "-__v",
				populate: [
					{
						path: "service",
						select: "-__v",
					},
				],
			})
			.select("-__v");
		if (!giftCards) return sendError(res, "Gift card not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving gift cards successfully", giftCards);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get gift card id from request params
	const { id } = req.params;

	try {
		// Get gift card by id
		const giftCard = await GiftCard.findById(id)
			.populate({
				path: "promotion",
				select: "-__v",
				populate: [
					{
						path: "service",
						select: "-__v",
					},
				],
			})
			.select("-__v");
		if (!giftCard) return sendError(res, "Gift card not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving gift card successfully", giftCard);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	validateDatetime();

	if (!promotionId)
		return sendError(res, "Promotion can't be blank", 400, "promotionId");
	if (!expirationDate)
		return sendError(
			res,
			"Expiration date can't be blank",
			400,
			"expirationDate"
		);
	if (validate({ expirationDate }, expirationDateConstraint))
		return sendError(
			res,
			"Expiration must be a valid date",
			400,
			"expirationDate"
		);
	if (!value && value !== 0)
		return sendError(res, "Value can't be blank", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Value must be numeric and greater than or equal to 1",
			400,
			"value"
		);
	if (!status) return sendError(res, "Status can't be blank", 400, "status");
	if (validate({ status }, statusConstraint))
		return sendError(
			res,
			`${status} is not included in the list`,
			400,
			"status"
		);

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(promotionId);
		if (!promotion)
			return sendError(
				res,
				`${
					promotion ? promotion.name : "Promotion id"
				} isn't included in the list`,
				404,
				"promotion"
			);

		const newGiftCard = new GiftCard({
			...req.body,
			code: generateRandomCode(),
			promotion: promotionId,
		});
		await newGiftCard.save();

		// Send success notification
		return sendSuccess(res, "Gift card created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get gift card id from request params
	const { id } = req.params;
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	validateDatetime();

	if (!promotionId)
		return sendError(res, "Promotion can't be blank", 400, "promotionId");
	if (!expirationDate)
		return sendError(
			res,
			"Expiration date can't be blank",
			400,
			"expirationDate"
		);
	if (validate({ expirationDate }, expirationDateConstraint))
		return sendError(
			res,
			"Expiration must be a valid date",
			400,
			"expirationDate"
		);
	if (!value && value !== 0)
		return sendError(res, "Value can't be blank", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Value must be numeric and greater than or equal to 1",
			400,
			"value"
		);
	if (!status) return sendError(res, "Status can't be blank", 400, "status");
	if (validate({ status }, statusConstraint))
		return sendError(
			res,
			`${status} is not included in the list`,
			400,
			"status"
		);

	try {
		// Get gift card by id
		const giftCard = await GiftCard.findById(id);
		if (!giftCard) return sendError(res, "Gift card not found", 404);

		// Get promotion by id
		const promotion = await Promotion.findById(promotionId);
		if (!promotion)
			return sendError(
				res,
				`${
					promotion ? promotion.name : "Promotion"
				} isn't included in the list`,
				404,
				"promotion"
			);

		await GiftCard.findByIdAndUpdate(
			id,
			{ ...req.body, code: giftCard.code, promotion: promotionId },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Edited gift card successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all gift cards
		const giftCards = await GiftCard.find();
		if (!giftCards) return sendError(res, "Gift card not found", 404);

		// Delete all gift cards
		await GiftCard.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all gift cards successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get gift card id from request params
	const { id } = req.params;

	try {
		// Get gift card by id
		const giftCard = await GiftCard.findByIdAndDelete(id);
		if (!giftCard) return sendError(res, "Gift card not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete gift card successfully");
	} catch (error) {
		next(error);
	}
};