import moment from "moment";
import nodemailer from "nodemailer";
import validate from "validate.js";
import {
	ROLES,
	durationConstraint,
	endDateConstraint,
	startDateConstraint,
	statusAppointmentConstraint,
} from "../constants.js";
import Appointment from "../models/Appointment.js";
import Location from "../models/Location.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDatetime.js";

export const getAll = async (req, res, next) => {
	try {
		// Get all appointments
		const appointments = await Appointment.find()
			.populate({
				path: "user",
				select: "-__v -password",
			})
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.populate({
				path: "service",
				select: "-__v",
			})
			.populate({
				path: "location",
				select: "-__v",
			})
			.select("-__v");
		if (!appointments) return sendError(res, "Cuộc hẹn không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất cuộc hẹn thành công", appointments);
	} catch (error) {
		next(error);
	}
};

export const getById = async (req, res, next) => {
	// Get appointment by id
	const { id } = req.params;

	try {
		// Get appointment by id
		const appointment = await Appointment.findById(id)
			.populate({
				path: "user",
				select: "-__v -password",
			})
			.populate({
				path: "staff",
				select: "-__v -password",
			})
			.populate({
				path: "service",
				select: "-__v",
			})
			.populate({
				path: "location",
				select: "-__v",
			})
			.select("-__v");
		if (!appointment) return sendError(res, "Cuộc hẹn không tồn tại", 404);

		// Send success notification
		return sendSuccess(res, "Truy xuất cuộc hẹn thành công", appointment);
	} catch (error) {
		next(error);
	}
};

export const create = async (req, res, next) => {
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const {
		duration,
		endDate,
		serviceId,
		staffId,
		startDate,
		emailTo,
		locationId,
	} = req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Dịch vụ không được để trống", 400, "serviceId");
	if (!locationId)
		return sendError(res, "Vị trí không được để trống", 400, "locationId");
	if (!staffId)
		return sendError(res, "Nhân viên không được để trống", 400, "staffId");
	if (!duration && duration !== 0)
		return sendError(
			res,
			"Khoảng thời gian không được để trống",
			400,
			"duration"
		);
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Khoảng thời gian phải lớn hơn hoặc bằng 0",
			400,
			"duration"
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
	if (!emailTo)
		return sendError(res, "Email đến không được để trống", 400, "emailTo");

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(res, "Dịch vụ không có trong danh sách", 404, "service");

		// Get location by id
		const location = await Location.findById(locationId);
		if (!location)
			return sendError(
				res,
				"Vị trí không được bao gồm trong danh sách",
				404,
				"location"
			);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Nhân viên không có trong danh sách", 404, "staff");
		if (
			staff.role !== ROLES["Nhân viên"] &&
			staff.role !== ROLES["Quản trị viên"]
		)
			return sendError(
				res,
				"Người dùng không phải là nhân viên hoặc quản trị viên"
			);

		const newAppointment = new Appointment({
			...req.body,
			service: serviceId,
			staff: staffId,
			location: locationId,
			user: userId,
		});
		await newAppointment.save();

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "hoangsang.nguyen2001a@gmail.com",
				pass: "znloocntppwxygnr",
			},
		});

		const mailOptions = {
			from: "hoangsang.nguyen2001a@gmail.com",
			to: emailTo,
			subject: "Thanks for booking the appointment",
			html: `<!doctype html>
			<html>
				<head>
					<style>
			@media only screen and (max-width: 620px) {
				table.body h1 {
					font-size: 28px !important;
					margin-bottom: 10px !important;
				}

				table.body p,
			table.body ul,
			table.body ol,
			table.body td,
			table.body span,
			table.body a {
					font-size: 16px !important;
				}

				table.body .wrapper,
			table.body .article {
					padding: 10px !important;
				}

				table.body .content {
					padding: 0 !important;
				}

				table.body .container {
					padding: 0 !important;
					width: 100% !important;
				}

				table.body .main {
					border-left-width: 0 !important;
					border-radius: 0 !important;
					border-right-width: 0 !important;
				}

				table.body .btn table {
					width: 100% !important;
				}

				table.body .btn a {
					width: 100% !important;
				}

				table.body .img-responsive {
					height: auto !important;
					max-width: 100% !important;
					width: auto !important;
				}
			}
			@media all {
				.ExternalClass {
					width: 100%;
				}

				.ExternalClass,
			.ExternalClass p,
			.ExternalClass span,
			.ExternalClass font,
			.ExternalClass td,
			.ExternalClass div {
					line-height: 100%;
				}

				.apple-link a {
					color: inherit !important;
					font-family: inherit !important;
					font-size: inherit !important;
					font-weight: inherit !important;
					line-height: inherit !important;
					text-decoration: none !important;
				}

				#MessageViewBody a {
					color: inherit;
					text-decoration: none;
					font-size: inherit;
					font-family: inherit;
					font-weight: inherit;
					line-height: inherit;
				}
			}
			</style>
				</head>
				<body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
					<span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
					<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
						<tr>
							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
							<td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
								<div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">

									<!-- START CENTERED WHITE CONTAINER -->
									<table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

										<!-- START MAIN CONTENT AREA -->
										<tr>
											<td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
												<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
													<tr>
														<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
															<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi ${emailTo},</p>
															<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
																<tbody>
																	<tr>
																		<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
																			<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
																				<tbody>
																					<tr>
																						<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; padding: 10px; text-align: center; background-color: #FFC26D;" valign="top" align="center" bgcolor="#FFC26D">
																							Thank you for choosing Spa Appointment for your appointment. We greatly appreciate your business and the opportunity to serve you. We look forward to seeing you at your scheduled appointment.
																						</td>
																					</tr>
																					<br/>
																					<tr>
																						<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; padding: 10px; text-align: center; background-color: #FFC26D;" valign="top" align="center" bgcolor="#FFC26D">
																							<p>Location: ${location.fullName}</p>
																							<p>Duration: ${duration}</p>
																							<p>Staff name: ${staff.firstName} ${staff.lastName}</p>
																							<p>Start: ${startDate}</p>
																							<p>End: ${endDate}</p>
																						</td>
																					</tr>
																				</tbody>
																			</table>
																		</td>
																	</tr>
																</tbody>
															</table>
															<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
															If you run into problems, please contact with me at https://www.facebook.com/nguyenluhoangsang01</p>
															<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Best regards, <br /> Nguyễn Lữ Hoàng Sang <br /> 0776689228 </p>
														</td>
													</tr>
												</table>
											</td>
										</tr>

									<!-- END MAIN CONTENT AREA -->
									</table>
									<!-- END CENTERED WHITE CONTAINER -->
								</div>
							</td>
							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
						</tr>
					</table>
				</body>
			</html>`,
		};

		// Send to
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info);
			}
		});

		// Update count appointment
		await User.findByIdAndUpdate(
			userId,
			{
				countAppointment: user.countAppointment + 1,
				countPrice: user.countPrice + service.price,
			},
			{ new: true }
		);

		await Service.findByIdAndUpdate(
			serviceId,
			{
				countServices: service.countServices + 1,
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			staffId,
			{
				countStaff: staff.countStaff + 1,
			},
			{ new: true }
		);

		await Location.findByIdAndUpdate(
			locationId,
			{
				countLocation: location.countLocation + 1,
			},
			{ new: true }
		);

		// Sen success notification
		return sendSuccess(res, "Đã tạo cuộc hẹn thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const updateById = async (req, res, next) => {
	// Get appointment id from request params
	const { id } = req.params;
	// Get user id from request
	const { userId } = req;
	// Get data from request body
	const {
		duration,
		endDate,
		serviceId,
		staffId,
		startDate,
		status,
		locationId,
	} = req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Dịch vụ không được để trống", 400, "serviceId");
	if (!locationId)
		return sendError(res, "Vị trí không được để trống", 400, "locationId");
	if (!staffId)
		return sendError(res, "Nhân viên không được để trống", 400, "staffId");
	if (!duration && duration !== 0)
		return sendError(
			res,
			"Khoảng thời gian không được để trống",
			400,
			"duration"
		);
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Khoảng thời gian phải là số và lớn hơn 0",
			400,
			"duration"
		);
	if (!status)
		return sendError(res, "Trạng thái không được để trống", 400, "status");
	if (validate({ status }, statusAppointmentConstraint))
		return sendError(
			res,
			`${status} không được bao gồm trong danh sách`,
			400,
			"status"
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
		// Get appointment by id
		const appointment = await Appointment.findById(id);
		if (!appointment) return sendError(res, "Cuộc hẹn không tồn tại", 404);

		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "Người dùng không tồn tại", 404);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Nhân viên không có trong danh sách", 404, "staff");
		if (
			staff.role !== ROLES["Nhân viên"] &&
			staff.role !== ROLES["Quản trị viên"]
		)
			return sendError(
				res,
				"Người dùng không phải là nhân viên hoặc quản trị viên"
			);

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(res, "Dịch vụ không có trong danh sách", 404, "service");

		// Get location by id
		const location = await Location.findById(locationId);
		if (!location)
			return sendError(
				res,
				"Vị trí không được bao gồm trong danh sách",
				404,
				"location"
			);

		await Appointment.findByIdAndUpdate(
			id,
			{
				...req.body,
				service: serviceId,
				staff: staffId,
				location: locationId,
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			userId,
			{
				countPrice: user.countPrice + service.price,
			},
			{ new: true }
		);

		await Service.findByIdAndUpdate(
			serviceId,
			{
				countServices: service.countServices + 1,
			},
			{ new: true }
		);

		await User.findByIdAndUpdate(
			staffId,
			{
				countStaff: staff.countStaff + 1,
			},
			{ new: true }
		);

		await Location.findByIdAndUpdate(
			locationId,
			{
				countLocation: location.countLocation + 1,
			},
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Đã chỉnh sửa cuộc hẹn thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all appointments
		const appointments = await Appointment.find();
		if (!appointments) return sendError(res, "Cuộc hẹn không tồn tại", 404);

		// Delete all appointments
		await Appointment.deleteMany();

		// Send success notification
		return sendSuccess(res, "Xóa tất cả các cuộc hẹn thành công");
	} catch (error) {
		next(error);
	}
};

export const deleteById = async (req, res, next) => {
	// Get appointment id from request params
	const { id } = req.params;

	try {
		// Get appointment by id
		const appointment = await Appointment.findByIdAndDelete(id);
		if (!appointment) return sendError(res, "Cuộc hẹn không tồn tại", 404);

		const appointmentStartDate = appointment.startDate.split("- ")[1];
		// Three days after
		const threeDaysAfter = moment(appointmentStartDate).add(3, "days");

		// Check if current time before appointment date about times
		if (moment().isBefore(threeDaysAfter))
			return sendError(res, `Không thể hủy cuộc hẹn này`, 400);

		// Send success notification
		return sendSuccess(res, "Xóa tất cuộc hẹn thành công");
	} catch (error) {
		next(error);
	}
};
