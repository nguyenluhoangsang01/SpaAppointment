import Promotion from "../models/Promotion.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all promotions
		const promotions = await Promotion.find()
			.select("-__v")
			.populate("service", "-__v");
		if (!promotions) return sendError(res, "Promotion not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving promotions successfully", promotions);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get promotion id from request params
	const { id } = req.params;

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(id)
			.select("-__v")
			.populate("service", "-__v");
		if (!promotion) return sendError(res, "Promotion not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving promotion successfully", promotion);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	try {
		const newPromotion = new Promotion({
			...req.body,
		});
		await newPromotion.save();

		// Send success notification
		return sendSuccess(res, "Promotion created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get promotion id from request params
	const { id } = req.params;

	try {
		await Promotion.findByIdAndUpdate(id, { ...req.body }, { new: true });

		// Send success notification
		return sendSuccess(res, "Edited promotion successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all promotions
		const promotions = await Promotion.find();
		if (!promotions) return sendError(res, "Promotion not found", 404);

		// Delete all promotions
		await Promotion.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all promotions successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get promotion id from request params
	const { id } = req.params;

	try {
		// Get promotion by id
		const promotion = await Promotion.findByIdAndDelete(id);
		if (!promotion) return sendError(res, "Promotion not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete promotion successfully");
	} catch (error) {
		next(error);
	}
};