import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import validate from "validate.js";
import {
	avatarOptions,
	emailConstraint,
	newPasswordConstraint,
	phoneConstraint,
	roleConstraint,
} from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find().select("-__v -password");
		if (!users) return sendError(res, "Người dùng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất người dùng thành công", users);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get user id from request params
	const { id } = req.params;

	try {
		// Get user by id
		const user = await User.findById(id).select("-__v -password");
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất người dùng thành công", user);
	} catch (error) {
		next(error);
	}
};

export const getProfile = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;

	try {
		// Get user by id
		const user = await User.findById(userId).select("-__v -password");
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất người dùng thành công", user);
	} catch (error) {
		next(error);
	}
};

export const updateProfile = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { address, firstName, lastName } = req.body;

	// Validate
	if (!firstName)
		return sendError(res, "Họ không được để trống", 400, "firstName");
	if (!lastName)
		return sendError(res, "Tên không được để trống", 400, "lastName");
	if (!address)
		return sendError(res, "Địa chỉ không được để trống", 400, "address");

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Check file exist or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, avatarOptions)
				.then(async (result) => {
					await User.findByIdAndUpdate(
						userId,
						{
							...req.body,
							password: user.password,
							avatar: result.secure_url,
						},
						{ new: true }
					);
				});
		} else {
			await User.findByIdAndUpdate(
				userId,
				{ ...req.body, password: user.password },
				{ new: true }
			);
		}

		// Get user after updated
		const userUpdated = await User.findById(user._id).select("-__v -password");

		// Send success notification
		return sendSuccess(res, "Hồ sơ của bạn đã được chỉnh sửa thành công", {
			user: userUpdated,
		});
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get user id from request
	const { id } = req.params;
	// Get file from request
	const { file } = req;
	// Get data from request body
	const { address, email, firstName, lastName, phone, role } = req.body;

	if (!firstName)
		return sendError(res, "Họ không được để trống", 400, "firstName");
	if (!lastName)
		return sendError(res, "Tên không được để trống", 400, "lastName");
	if (!email) return sendError(res, "Email không được để trống", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email không phải là một email hợp lệ", 400, "email");
	if (!phone)
		return sendError(res, "Số điện thoại không được để trống", 400, "phone");
	if (validate({ phone }, phoneConstraint))
		return sendError(
			res,
			"Điện thoại phải là số điện thoại hợp lệ",
			400,
			"phone"
		);
	if (!role) return sendError(res, "Vai trò không được để trống", 400, "role");
	if (validate({ role }, roleConstraint))
		return sendError(res, `${role} không có trong danh sách`, 400, "role");
	if (!address)
		return sendError(res, "Địa chỉ không được để trống", 400, "address");

	try {
		// Get user by id
		const user = await User.findById(id);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Check email exists or not in database
		const isEmailExists = await User.findOne({
			email: { $eq: email, $ne: user.email },
		});
		if (isEmailExists)
			return sendError(
				res,
				`Email (${isEmailExists.email}) đã tồn tại`,
				409,
				"email"
			);
		// Check phone exists or not in database
		const isPhoneExists = await User.findOne({
			phone: { $eq: phone, $ne: user.phone },
		});
		if (isPhoneExists)
			return sendError(
				res,
				`Số điện thoại (${isPhoneExists.phone}) đã tồn tại`,
				409,
				"phone"
			);

		// Check file exist or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, avatarOptions)
				.then(async (result) => {
					await User.findByIdAndUpdate(
						id,
						{
							...req.body,
							password: user.password,
							avatar: result.secure_url,
						},
						{ new: true }
					);
				});
		} else {
			await User.findByIdAndUpdate(
				id,
				{ ...req.body, password: user.password },
				{ new: true }
			);
		}

		// Send success notification
		return sendSuccess(res, "Chỉnh sửa người dùng thành công", 200, null);
	} catch (error) {
		next(error);
	}
};

export const changePassword = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const { confirmPassword, currentPassword, newPassword } = req.body;

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Compare current password
		const isMatchCurrentPassword = bcrypt.compareSync(
			currentPassword,
			user.password
		);

		if (!currentPassword)
			return sendError(
				res,
				"Mật khẩu hiện tại không được để trống",
				400,
				"currentPassword"
			);
		if (!isMatchCurrentPassword)
			return sendError(
				res,
				"Mật khẩu hiện tại bạn đã nhập không chính xác",
				400,
				"currentPassword"
			);
		if (!newPassword)
			return sendError(
				res,
				"Mật khẩu mới không được để trống",
				400,
				"newPassword"
			);
		if (validate({ newPassword }, newPasswordConstraint))
			return sendError(
				res,
				"Mật khẩu mới phải dài ít nhất 8 ký tự và phải chứa ít nhất một chữ thường, một chữ in hoa, một số và một ký tự đặc biệt",
				400,
				"newPassword"
			);
		const isMatchNewPassword = bcrypt.compareSync(newPassword, user.password);
		if (isMatchNewPassword)
			return sendError(
				res,
				"Mật khẩu mới phải khác mật khẩu cũ",
				400,
				"newPassword"
			);
		if (!confirmPassword)
			return sendError(
				res,
				"Xác nhận mật khẩu mới không được để trống",
				400,
				"confirmPassword"
			);
		if (confirmPassword !== newPassword)
			return sendError(
				res,
				"Xác nhận mật khẩu mới không bằng mật khẩu mới",
				400,
				"confirmPassword"
			);

		// Hash new password
		const hashedNewPassword = await hashPassword(newPassword);

		// Update user with new hashed password
		await User.findByIdAndUpdate(
			userId,
			{ password: hashedNewPassword },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Mật khẩu của bạn đã được thay đổi");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all users
		const users = await User.find();
		if (!users) return sendError(res, "Người dùng không tồn tại", 404);

		// Delete all users
		await User.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả người dùng thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get user id from request params
	const { id } = req.params;
	// Get user id from request
	const { userId } = req;

	// Check if 2 IDs are the same
	if (id === userId) return sendError(res, "Không thể xóa người dùng hiện tại");

	try {
		// Get user by id
		const user = await User.findByIdAndDelete(id);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Xóa người dùng thành công");
	} catch (error) {
		next(error);
	}
};