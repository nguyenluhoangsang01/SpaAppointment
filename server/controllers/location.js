import Location from "../models/Location.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getALl = async (req, res, next) => {
	try {
		// Get all locations
		const locations = await Location.find().select("-__v");
		if (!locations) return sendError(res, "Không tìm thấy địa điểm", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất địa điểm thành công", locations);
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
		if (!location) return sendError(res, "Không tìm thấy địa điểm", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất địa điểm thành công", location);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get data from request body
	const { fullName, shortName } = req.body;

	// Validate
	if (!fullName)
		return sendError(res, "Tên đầy đủ không được để trống", 400, "fullName");
	if (!shortName)
		return sendError(res, "Tên viết tắt không được để trống", 400, "shortName");

	try {
		// Check full name exists or not in database
		const isFullNameExists = await Location.findOne({ fullName });
		if (isFullNameExists)
			return sendError(
				res,
				`Địa điểm với tên đầy đủ này (${isFullNameExists.fullName}) đã tồn tại`,
				409,
				"fullName"
			);

		// Check short name exists or not in database
		const isShortNameExists = await Location.findOne({ shortName });
		if (isShortNameExists)
			return sendError(
				res,
				`Địa điểm với tên viết tắt này (${isShortNameExists.shortName}) đã tồn tại`,
				409,
				"shortName"
			);

		const newLocation = new Location({ ...req.body });
		await newLocation.save();

		// Send success notification
		return sendSuccess(res, "Tạo địa điểm thành công", null, 201);
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
		return sendError(res, "Tên đầy đủ không được để trống", 400, "fullName");
	if (!shortName)
		return sendError(res, "Tên viết tắt không được để trống", 400, "shortName");

	try {
		// Get location by id
		const location = await Location.findById(id);
		if (!location) return sendError(res, "Không tìm thấy địa điểm", 404);

		// Check full name exists or not in database
		const isFullNameExists = await Location.findOne({
			fullName: { $eq: fullName, $ne: location.fullName },
		});
		if (isFullNameExists)
			return sendError(
				res,
				`Địa điểm với tên đầy đủ này (${isFullNameExists.fullName}) đã tồn tại`,
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
				`Địa điểm với tên viết tắt này (${isShortNameExists.shortName}) đã tồn tại`,
				409,
				"shortName"
			);

		await Location.findByIdAndUpdate(id, { ...req.body }, { new: true });

		// Send success notification
		return sendSuccess(res, "Địa điểm được tạo thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all locations
		const locations = await Location.find();
		if (!locations) return sendError(res, "Không tìm thấy địa điểm", 404);

		// Delete all locations
		await Location.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả các địa điểm thành công");
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
		if (!location) return sendError(res, "Không tìm thấy địa điểm", 404);

		// Send success notification
		return sendSuccess(res, "Xóa địa điểm thành công");
	} catch (error) {
		next(error);
	}
};