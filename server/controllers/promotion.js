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
import validateDatetime from "../utils/validateDatetime.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all promotions
		const promotions = await Promotion.find()
			.select("-__v")
			.populate("service", "-__v");
		if (!promotions) return sendError(res, "Không tìm thấy khuyến mãi", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất khuyến mãi thành công", promotions);
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
		if (!promotion) return sendError(res, "Không tìm thấy khuyến mãi", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất khuyến mãi thành công", promotion);
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

	if (!service)
		return sendError(res, "Dịch vụ không được để trống", 400, "service");
	if (!name) return sendError(res, "Tên không được để trống", 400, "name");
	if (!description)
		return sendError(res, "Mô tả không được để trống", 400, "description");
	if (!type)
		return sendError(res, "Loại khuyến mãi không được để trống", 400, "type");
	if (validate({ type }, promotionTypesConstraint))
		return sendError(
			res,
			`${type} không được bao gồm trong danh sách`,
			400,
			"type"
		);
	if (!startDate)
		return sendError(res, "Ngày bắt đầu không được để trống", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(
			res,
			"Ngày bắt đầu phải là một ngày hợp lệ",
			400,
			"startDate"
		);
	if (!endDate)
		return sendError(res, "Ngày kết thúc không được để trống", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(
			res,
			"Ngày kết thúc phải là một ngày hợp lệ",
			400,
			"endDate"
		);
	if (!value && value !== 0)
		return sendError(res, "Giá trị không được để trống", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Giá trị phải là số và lớn hơn hoặc bằng 1",
			400,
			"value"
		);
	if (!maxUses && maxUses !== 0)
		return sendError(
			res,
			"Số lần sử dụng tối đa không được để trống",
			400,
			"maxUses"
		);
	if (validate({ maxUses }, maxUsesConstraint))
		return sendError(
			res,
			"Số lần sử dụng tối đa phải là số và lớn hơn hoặc bằng 1",
			400,
			"maxUses"
		);

	try {
		// Check name exists or not in database
		const isNameExists = await Promotion.findOne({ name });
		if (isNameExists)
			return sendError(
				res,
				`Tên khuyến mãi (${isNameExists.name}) đã tồn tại`,
				409,
				"name"
			);

		const newPromotion = new Promotion({ ...req.body });
		await newPromotion.save();

		// Send success notification
		return sendSuccess(res, "Tạo khuyến mãi thành công", null, 201);
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

	if (!service)
		return sendError(res, "Dịch vụ không được để trống", 400, "service");
	if (!name) return sendError(res, "Tên không được để trống", 400, "name");
	if (!description)
		return sendError(res, "Mô tả không được để trống", 400, "description");
	if (!type)
		return sendError(res, "Loại khuyến mãi không được để trống", 400, "type");
	if (validate({ type }, promotionTypesConstraint))
		return sendError(
			res,
			`${type} không được bao gồm trong danh sách`,
			400,
			"type"
		);
	if (!startDate)
		return sendError(res, "Ngày bắt đầu không được để trống", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(
			res,
			"Ngày bắt đầu phải là một ngày hợp lệ",
			400,
			"startDate"
		);
	if (!endDate)
		return sendError(res, "Ngày kết thúc không được để trống", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(
			res,
			"Ngày kết thúc phải là một ngày hợp lệ",
			400,
			"endDate"
		);
	if (!value && value !== 0)
		return sendError(res, "Giá trị không được để trống", 400, "value");
	if (validate({ value }, valueConstraint))
		return sendError(
			res,
			"Giá trị phải là số và lớn hơn hoặc bằng 1",
			400,
			"value"
		);
	if (!maxUses && maxUses !== 0)
		return sendError(
			res,
			"Số lần sử dụng tối đa không được để trống",
			400,
			"maxUses"
		);
	if (validate({ maxUses }, maxUsesConstraint))
		return sendError(
			res,
			"Số lần sử dụng tối đa phải là số và lớn hơn hoặc bằng 1",
			400,
			"maxUses"
		);

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(id);
		if (!promotion) return sendError(res, "Không tìm thấy khuyến mãi", 404);

		// Check name exists or not in database
		const isNameExists = await Promotion.findOne({
			name: { $eq: name, $ne: promotion.name },
		});
		if (isNameExists)
			return sendError(
				res,
				`Tên khuyến mãi (${isNameExists.name}) đã tồn tại`,
				409,
				"name"
			);

		await Promotion.findByIdAndUpdate(id, { ...req.body }, { new: true });

		// Send success notification
		return sendSuccess(res, "Chỉnh sửa khuyến mãi thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all promotions
		const promotions = await Promotion.find();
		if (!promotions) return sendError(res, "Không tìm thấy khuyến mãi", 404);

		// Delete all promotions
		await Promotion.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả khuyến mãi thành công");
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
		if (!promotion) return sendError(res, "Không tìm thấy khuyến mãi", 404);

		// Send success notification
		return sendSuccess(res, "Xóa khuyến mãi thành công");
	} catch (error) {
		next(error);
	}
};