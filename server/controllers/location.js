import Location from "../models/Location.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getALl = async (req, res, next) => {
	try {
		// Get all locations
		const locations = await Location.find().select("-__v");
		if (!locations) return sendError(res, "Location not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving locations successfully", locations);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get location id from request params
	const { id } = req.params;

	try {
		// Get location by id
		const location = await Location.findById(id).select("-__v");
		if (!location) return sendError(res, "Location not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving location successfully", location);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get data from request body
	const { fullName, shortName } = req.body;

	// Validate
	if (!fullName)
		return sendError(res, "Full name can't be blank", 400, "fullName");
	if (!shortName)
		return sendError(res, "Short name can't be blank", 400, "shortName");

	try {
		// Check full name exists or not in database
		const isFullNameExists = await Location.findOne({ fullName });
		if (isFullNameExists)
			return sendError(
				res,
				`Location with this full name (${isFullNameExists.fullName}) already exists`,
				409,
				"fullName"
			);

		// Check short name exists or not in database
		const isShortNameExists = await Location.findOne({ shortName });
		if (isShortNameExists)
			return sendError(
				res,
				`Location with this short name (${isShortNameExists.shortName}) already exists`,
				409,
				"shortName"
			);

		const newLocation = new Location({ ...req.body });
		await newLocation.save();

		// Send success notification
		return sendSuccess(res, "Location created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get location id from request params
	const { id } = req.params;
	// Get data from request body
	const { fullName, shortName } = req.body;

	// Validate
	if (!fullName)
		return sendError(res, "Full name can't be blank", 400, "fullName");
	if (!shortName)
		return sendError(res, "Short name can't be blank", 400, "shortName");

	try {
		// Get location by id
		const location = await Location.findById(id);
		if (!location) return sendError(res, "Location not found", 404);

		// Check full name exists or not in database
		const isFullNameExists = await Location.findOne({
			fullName: { $eq: fullName, $ne: location.fullName },
		});
		if (isFullNameExists)
			return sendError(
				res,
				`Location with this full name (${isFullNameExists.fullName}) already exists`,
				409,
				"fullName"
			);

		// Check short name exists or not in database
		const isShortNameExists = await Location.findOne({
			shortName: { $eq: shortName, $ne: location.shortName },
		});
		if (isShortNameExists)
			return sendError(
				res,
				`Location with this short name (${isShortNameExists.shortName}) already exists`,
				409,
				"shortName"
			);

		await Location.findByIdAndUpdate(id, { ...req.body }, { new: true });

		// Send success notification
		return sendSuccess(res, "Location created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all locations
		const locations = await Location.find();
		if (!locations) return sendError(res, "Location not found", 404);

		// Delete all locations
		await Location.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all locations successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get location id from request params
	const { id } = req.params;

	try {
		// Get location by id
		const location = await Location.findByIdAndDelete(id);
		if (!location) return sendError(res, "Location not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete location successfully");
	} catch (error) {
		next(error);
	}
};