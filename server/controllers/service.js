import { v2 as cloudinary } from "cloudinary";
import { serviceOptions } from "../constants.js";
import Service from "../models/Service.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all services
		const services = await Service.find().select("-__v");
		if (!services) return sendError(res, "Service not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving services successfully", services);
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
		if (!service) return sendError(res, "Service not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving service successfully", service);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get data from request body
	const { name } = req.body;
	// Get file from request
	const { file } = req;

	try {
		// Check name exists or not in database
		const isNameExists = await Service.findOne({ name });
		if (isNameExists)
			return sendError(res, "Service with this name already exists");

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
		return sendSuccess(res, "Service created successfully", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get service id from request params
	const { id } = req.params;
	// Get data from request body
	const { name } = req.body;
	// Get file from request
	const { file } = req;

	try {
		// Get service by id
		const service = await Service.findById(id);

		// Check name exists or not in database
		const isNameExists = await Service.findOne({
			name: { $eq: name, $ne: service.name },
		});
		if (isNameExists)
			return sendError(
				res,
				`Service with this name (${isNameExists.name}) already exists`
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
		return sendSuccess(res, "Successfully edited service");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all services
		const services = await Service.find();
		if (services.length <= 0) return sendError(res, "Service not found", 404);

		// Delete all services
		await Service.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all services successfully");
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
		if (!service) return sendError(res, "Service not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete service successfully");
	} catch (error) {
		next(error);
	}
};