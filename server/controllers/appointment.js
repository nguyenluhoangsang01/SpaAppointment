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
import Service from "../models/Service.js";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import validateDatetime from "../utils/validateDateTime.js";

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
			.select("-__v");
		if (!appointments) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(
			res,
			"Retrieving appointments successfully",
			appointments
		);
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
			.select("-__v");
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(res, "Retrieving appointment successfully", appointment);
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
		title,
		emailTo,
	} = req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Service can't be blank", 400, "serviceId");
	if (!staffId) return sendError(res, "Staff can't be blank", 400, "staffId");
	if (!title) return sendError(res, "Title can't be blank", 400, "title");
	if (!duration && duration !== 0)
		return sendError(res, "Duration can't be blank", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Duration must be numeric and greater than 0",
			400,
			"duration"
		);
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");
	if (!emailTo)
		return sendError(res, "Email to can't be blank", 400, "emailTo");

	try {
		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Staff isn't included in the list", 404, "staff");
		if (staff.role !== ROLES.Staff) return sendError(res, "User isn't a staff");

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(
				res,
				"Service isn't included in the list",
				404,
				"service"
			);

		const newAppointment = new Appointment({
			...req.body,
			service: serviceId,
			staff: staffId,
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
																							<p>Title: ${title}</p>
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

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info);
			}
		});

		// Sen success notification
		return sendSuccess(res, "Appointment created successfully", null, 201);
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
	const { duration, endDate, serviceId, staffId, startDate, status, title } =
		req.body;

	validateDatetime();

	if (!serviceId)
		return sendError(res, "Service can't be blank", 400, "serviceId");
	if (!staffId) return sendError(res, "Staff can't be blank", 400, "staffId");
	if (!title) return sendError(res, "Title can't be blank", 400, "title");
	if (!duration && duration !== 0)
		return sendError(res, "Duration can't be blank", 400, "duration");
	if (validate({ duration }, durationConstraint))
		return sendError(
			res,
			"Duration must be numeric and greater than 0",
			400,
			"duration"
		);
	if (!status) return sendError(res, "Status can't be blank", 400, "status");
	if (validate({ status }, statusAppointmentConstraint))
		return sendError(
			res,
			`${status} is not included in the list`,
			400,
			"status"
		);
	if (!startDate)
		return sendError(res, "Start date can't be blank", 400, "startDate");
	if (validate({ startDate }, startDateConstraint))
		return sendError(res, "Start date must be a valid date", 400, "startDate");
	if (!endDate)
		return sendError(res, "End date can't be blank", 400, "endDate");
	if (validate({ endDate }, endDateConstraint))
		return sendError(res, "End date must be a valid date", 400, "endDate");

	try {
		// Get appointment by id
		const appointment = await Appointment.findById(id);
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Get user by id
		const user = await User.findById(userId);
		if (!user) return sendError(res, "User not found", 404);

		// Get staff by id
		const staff = await User.findById(staffId);
		if (!staff)
			return sendError(res, "Staff isn't included in the list", 404, "staff");
		if (staff.role !== ROLES.Staff) return sendError(res, "User isn't a staff");

		// Get service by id
		const service = await Service.findById(serviceId);
		if (!service)
			return sendError(
				res,
				"Service isn't included in the list",
				404,
				"service"
			);

		await Appointment.findByIdAndUpdate(
			id,
			{ ...req.body, services: serviceId, staff: staffId },
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "Edited appointment successfully");
	} catch (error) {
		next(error);
	}
};

export const deleteAll = async (req, res, next) => {
	try {
		// Get all appointments
		const appointments = await Appointment.find();
		if (!appointments) return sendError(res, "Appointment not found", 404);

		// Delete all appointments
		await Appointment.deleteMany();

		// Send success notification
		return sendSuccess(res, "Delete all appointments successfully");
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
		if (!appointment) return sendError(res, "Appointment not found", 404);

		// Send success notification
		return sendSuccess(res, "Delete appointment successfully");
	} catch (error) {
		next(error);
	}
};
