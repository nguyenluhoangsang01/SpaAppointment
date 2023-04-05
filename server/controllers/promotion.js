import validate from "validate.js";
import {
	endDateConstraint,
	maxUsesConstraint,
	promotionTypesConstraint,
	startDateConstraint,
	valueConstraint,
} from "../constants.js";
import Promotion from "../models/Promotion.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDateTime.js";

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

	validateDatetime();

	if (!service) return sendError(res, "Service can't be blank", 400, "service");
	if (!name) return sendError(res, "Name can't be blank", 400, "name");
	if (!description)
		return sendError(res, "Description can't be blank", 400, "description");
	if (!type) return sendError(res, "Type can't be blank", 400, "type");
	if (validate({ type }, promotionTypesConstraint))
		return sendError(res, `${type} is not included in the list`, 400, "type");
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");
	if (!value && value !== 0)
		return sendError(res, "Value can't be blank", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Value must be numeric and greater than or equal to 1",
			400,
			"value"
		);
	if (!maxUses && maxUses !== 0)
		return sendError(res, "Max uses can't be blank", 400, "maxUses");
	if (validate({ maxUses }, maxUsesConstraint))
		return sendError(
			res,
			"Max uses must be numeric and greater than or equal to 1",
			400,
			"maxUses"
		);

	try {
		// Check name exists or not in database
		const isNameExists = await Promotion.findOne({ name });
		if (isNameExists)
			return sendError(
				res,
				`Promotion with this name (${isNameExists.name}) already exists`,
				409,
				"name"
			);

		const newPromotion = new Promotion({ ...req.body });
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

	validateDatetime();

	if (!service) return sendError(res, "Service can't be blank", 400, "service");
	if (!name) return sendError(res, "Name can't be blank", 400, "name");
	if (!description)
		return sendError(res, "Description can't be blank", 400, "description");
	if (!type) return sendError(res, "Type can't be blank", 400, "type");
	if (validate({ type }, promotionTypesConstraint))
		return sendError(res, `${type} is not included in the list`, 400, "type");
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");
	if (!value && value !== 0)
		return sendError(res, "Value can't be blank", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Value must be numeric and greater than or equal to 0",
			400,
			"value"
		);
	if (!maxUses && maxUses !== 0)
		return sendError(res, "Max uses can't be blank", 400, "maxUses");
	if (validate({ maxUses }, maxUsesConstraint))
		return sendError(
			res,
			"Max uses must be numeric and greater than or equal to 1",
			400,
			"maxUses"
		);

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(id);
		if (!promotion) return sendError(res, "Promotion not found", 404);

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