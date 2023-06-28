import validate from "validate.js";
import {
	expirationDateConstraint,
	statusConstraint,
	valueConstraint,
} from "../constants.js";
import GiftCard from "../models/GiftCard.js";
import Promotion from "../models/Promotion.js";
import generateRandomCode from "../utils/generateRandomCode.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDateTime.js";

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
		if (!giftCards) return sendError(res, "Thẻ quà tặng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất thẻ quà tặng thành công", giftCards);
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
		if (!giftCard) return sendError(res, "Thẻ quà tặng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất thẻ quà tặng thành công", giftCard);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	validateDatetime();

	if (!promotionId)
		return sendError(res, "Khuyến mãi không được để trống", 400, "promotionId");
	if (!expirationDate)
		return sendError(
			res,
			"Ngày hết hạn không được để trống",
			400,
			"expirationDate"
		);
	if (validate({ expirationDate }, expirationDateConstraint))
		return sendError(
			res,
			"Ngày hết hạn phải là một ngày hợp lệ",
			400,
			"expirationDate"
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
	if (!status)
		return sendError(res, "Trạng thái không được để trống", 400, "status");
	if (validate({ status }, statusConstraint))
		return sendError(
			res,
			`${status} không được bao gồm trong danh sách`,
			400,
			"status"
		);

	try {
		// Get promotion by id
		const promotion = await Promotion.findById(promotionId);
		if (!promotion)
			return sendError(
				res,
				`${
					promotion ? promotion.name : "Mã khuyến mãi"
				} không được bao gồm trong danh sách`,
				404,
				"promotionId"
			);

		const newGiftCard = new GiftCard({
			...req.body,
			code: generateRandomCode(),
			promotion: promotionId,
		});
		await newGiftCard.save();

		// Send success notification
		return sendSuccess(res, "Tạo thẻ quà tặng thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get gift card id from request params
	const { id } = req.params;
	// Get data from request body
	const { expirationDate, promotionId, status, value } = req.body;

	validateDatetime();

	if (!promotionId)
		return sendError(res, "Khuyến mãi không được để trống", 400, "promotionId");
	if (!expirationDate)
		return sendError(
			res,
			"Ngày hết hạn không được để trống",
			400,
			"expirationDate"
		);
	if (validate({ expirationDate }, expirationDateConstraint))
		return sendError(
			res,
			"Ngày hết hạn phải là một ngày hợp lệ",
			400,
			"expirationDate"
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
	if (!status)
		return sendError(res, "Trạng thái không được để trống", 400, "status");
	if (validate({ status }, statusConstraint))
		return sendError(
			res,
			`${status} không được bao gồm trong danh sách`,
			400,
			"status"
		);

	try {
		// Get gift card by id
		const giftCard = await GiftCard.findById(id);
		if (!giftCard) return sendError(res, "Thẻ quà tặng không tồn tại", 404);

		// Get promotion by id
		const promotion = await Promotion.findById(promotionId);
		if (!promotion)
			return sendError(
				res,
				`${
					promotion ? promotion.name : "Mã khuyến mãi"
				} không được bao gồm trong danh sách`,
				404,
				"promotionId"
			);

		await GiftCard.findByIdAndUpdate(
			id,
			{ ...req.body, code: giftCard.code, promotion: promotionId },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Chỉnh sửa thẻ quà tặng thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all gift cards
		const giftCards = await GiftCard.find();
		if (!giftCards) return sendError(res, "Thẻ quà tặng không tồn tại", 404);

		// Delete all gift cards
		await GiftCard.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả thẻ quà tặng thành công");
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
		if (!giftCard) return sendError(res, "Thẻ quà tặng không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Xóa thẻ quà tặng thành công");
	} catch (error) {
		next(error);
	}
};