import GiftCard from "../models/GiftCard.js";
import generateRandomCode from "../utils/generateRandomCode.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

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
	const { promotionId } = req.body;

	try {
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
	const { promotionId } = req.body;

	try {
		// Get gift card by id
		const giftCard = await GiftCard.findById(id);

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
		if (giftCards.length <= 0)
			return sendError(res, "Gift card not found", 404);

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