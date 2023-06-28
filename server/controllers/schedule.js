import validate from "validate.js";
import {
	endDateConstraint,
	startDateConstraint,
	typeConstraint,
} from "../constants.js";
import Schedule from "../models/Schedule.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDatetime.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all schedule
		const schedule = await Schedule.find()
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.select("-__v");
		if (!schedule) return sendError(res, "Lịch trình không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất lịch trình thành công", schedule);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get schedule by id
	const { id } = req.params;

	try {
		// Get schedule by id
		const schedule = await Schedule.findById(id)
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.select("-__v");
		if (!schedule) return sendError(res, "Lịch trình không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất lịch trình thành công", schedule);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { type, startDate, endDate } = req.body;

	validateDatetime();

	if (!type)
		return sendError(res, "Loại làm việc không thể để trống", 400, "type");
	if (validate({ type }, typeConstraint))
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

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		if (user.role !== "Quản trị viên" && user.role !== "Nhân viên")
			return sendError(res, "Bạn không có quyền làm điều này", 403);

		// Create a new schedule
		const newSchedule = new Schedule({
			...req.body,
			staff: userId,
		});
		await newSchedule.save();

		// Sen success notification
		return sendSuccess(res, "Tạo lịch trình làm việc thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get schedule id from request params
	const { id } = req.params;
	// Get data from request body
	const { type, startDate, endDate } = req.body;

	validateDatetime();

	if (!type)
		return sendError(res, "Loại làm việc không thể để trống", 400, "type");
	if (validate({ type }, typeConstraint))
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

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		if (user.role !== "Quản trị viên" && user.role !== "Nhân viên")
			return sendError(res, "Bạn không có quyền làm điều này", 403);

		// Get schedule by id
		const schedule = await Schedule.findById(id);
		if (!schedule) return sendError(res, "Lịch trình không tồn tại", 404);

		// Update
		await Schedule.findByIdAndUpdate(id, { ...req.body }, { new: true });

		// Send success notification
		return sendSuccess(res, "Chỉnh sửa lịch trình làm việc thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all schedule
		const schedule = await Schedule.find();
		if (!schedule) return sendError(res, "Lịch trình không tồn tại", 404);

		// Delete all schedule
		await Schedule.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả lịch trình thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get schedule id from request params
	const { id } = req.params;

	try {
		// Get schedule by id
		const schedule = await Schedule.findByIdAndDelete(id);
		if (!schedule) return sendError(res, "Lịch trình không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Xóa tất cả lịch trình thành công");
	} catch (error) {
		next(error);
	}
};