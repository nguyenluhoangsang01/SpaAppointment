import { v2 as cloudinary } from "cloudinary";
import validate from "validate.js";
import {
	durationConstraint,
	priceConstraint,
	serviceOptions,
} from "../constants.js";
import Service from "../models/Service.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all services
		const services = await Service.find().select("-__v");
		if (!services) return sendError(res, "Dịch vụ không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất dịch vụ thành công", services);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get service id from request params
	const { id } = req.params;

	try {
		// Get service by id
		const service = await Service.findById(id).select("-__v");
		if (!service) return sendError(res, "Dịch vụ không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất dịch vụ thành công", service);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { description, duration, name, price } = req.body;

	if (!name) return sendError(res, "Tên không được để trống", 400, "name");
	if (!price && price !== 0) return sendError(res, "Giá không được để trống", 400, "price");
	if (validate({ price }, priceConstraint))
		return sendError(
			res,
			"Giá phải là số và lớn hơn 0",
			400,
			"price"
		);
	if (!duration  && duration !== 0)
		return sendError(res, "Khoảng thời gian không được để trống", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Khoảng thời gian phải là số và lớn hơn 0",
			400,
			"duration"
		);
	if (!description)
		return sendError(res, "Mô tả không được để trống", 400, "description");

	try {
		// Check name exists or not in database
		const isNameExists = await Service.findOne({ name });
		if (isNameExists)
			return sendError(
				res,
				`Tên dịch vụ (${isNameExists.name}) đã tồn tại`,
				409,
				"name"
			);

		let newService;
		// Check file exists or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, serviceOptions)
				.then(async (result) => {
					// Create a new service with service image
					newService = new Service({
						...req.body,
						image: result.secure_url,
					});
				});
		} else {
			// Create a new service
			newService = new Service({ ...req.body });
		}
		await newService.save();

		// Send success notification
		return sendSuccess(res, "Tạo dịch vụ thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get service id from request params
	const { id } = req.params;
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { description, duration, name, price } = req.body;

	if (!name) return sendError(res, "Tên không được để trống", 400, "name");
	if (!price && price !== 0) return sendError(res, "Giá không được để trống", 400, "price");
	if (validate({ price }, priceConstraint))
		return sendError(
			res,
			"Giá phải là số và lớn hơn 0",
			400,
			"price"
		);
	if (!duration && duration !== 0)
		return sendError(res, "Khoảng thời gian không được để trống", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Khoảng thời gian phải là số và lớn hơn 0",
			400,
			"duration"
		);
	if (!description)
		return sendError(res, "Mô tả không được để trống", 400, "description");

	try {
		// Get service by id
		const service = await Service.findById(id);
		if (!service) return sendError(res, "Dịch vụ không tồn tại", 404);

		// Check name exists or not in database
		const isNameExists = await Service.findOne({
			name: { $eq: name, $ne: service.name },
		});
		if (isNameExists)
			return sendError(
				res,
				`Tên dịch vụ (${isNameExists.name}) đã tồn tại`,
				409,
				"name"
			);

		// Check file exists or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, serviceOptions)
				.then(async (result) => {
					await Service.findByIdAndUpdate(
						id,
						{ ...req.body, image: result.secure_url },
						{ new: true }
					);
				});
		} else {
			await Service.findByIdAndUpdate(id, { ...req.body }, { new: true });
		}

		// Send success notification
		return sendSuccess(res, "Chỉnh sửa dịch vụ thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all services
		const services = await Service.find();
		if (!services) return sendError(res, "Dịch vụ không tồn tại", 404);

		// Delete all services
		await Service.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả các dịch vụ thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get service id from request params
	const { id } = req.params;

	try {
		// Get service by id
		const service = await Service.findByIdAndDelete(id);
		if (!service) return sendError(res, "Dịch vụ không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Xóa tất cả các dịch vụ thành công");
	} catch (error) {
		next(error);
	}
};