import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import ip from "ip";
import jwt from "jsonwebtoken";
import moment from "moment";
import nodemailer from "nodemailer";
import validate from "validate.js";
import {
	ACCESS_TOKEN_EXPIRES_IN,
	avatarOptions,
	emailConstraint,
	formatDateTime,
	passwordConstraint,
	phoneConstraint,
	REFRESH_TOKEN_EXPIRES_IN,
} from "../constants.js";
import TempData from "../models/tempData.js";
import User from "../models/User.js";
import generateRandomCode from "../utils/generateRandomCode.js";
import generateVerifyCode from "../utils/generateVerifyCode.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const verifyEmail = async (req, res, next) => {
	// Get data from request body
	const { email } = req.body;

	if (!email) return sendError(res, "Email không được để trống", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email không phải là một email hợp lệ", 400, "email");

	// Generate code
	const activeCode = generateVerifyCode();

	try {
		// Check email exists or not in database
		const isEmailExists = await TempData.findOne({ email });
		if (isEmailExists) {
			await TempData.findByIdAndUpdate(isEmailExists._id, { activeCode });
		} else {
			const newTempDate = new TempData({
				...req.body,
				activeCode,
			});
			await newTempDate.save();
		}

		// Create transport
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "hoangsang.nguyen2001a@gmail.com",
				pass: "znloocntppwxygnr",
			},
		});

		const mailOptions = {
			from: "hoangsang.nguyen2001a@gmail.com",
			to: email,
			subject: "Xác thực email",
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
																<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi ${email},</p>
																<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
																	<tbody>
																		<tr>
																			<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
																				<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
																					<tbody>
																					<tr>
																					<td>Mã xác thực email:</td>
																					</tr>
																						<tr>
																							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; padding: 10px; text-align: center; background-color: #FFC26D;" valign="top" align="center" bgcolor="#FFC26D">
																								 ${activeCode}
																							</td>
																						</tr>
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

		// Send success notification
		return sendSuccess(
			res,
			"Chúng tôi đã gửi cho bạn 1 mã xác thực, bạn vui lòng kiểm tra trong hộp thư đến hoặc spam box của email.",
			null,
			201
		);
	} catch (error) {
		next(error);
	}
};

export const register = async (req, res, next) => {
	// Get file from request
	const { file } = req;
	// Get data from request body
	const {
		address,
		email,
		activeCode,
		confirmPassword,
		firstName,
		lastName,
		password,
		phone,
	} = req.body;

	if (!email) return sendError(res, "Email không được để trống", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email không phải là một email hợp lệ", 400, "email");
	if (!firstName)
		return sendError(res, "Họ không được để trống", 400, "firstName");
	if (!lastName)
		return sendError(res, "Tên không được để trống", 400, "lastName");
	if (!phone)
		return sendError(res, "Số điện thoại không được để trống", 400, "phone");
	if (validate({ phone }, phoneConstraint))
		return sendError(
			res,
			"Điện thoại phải là số điện thoại hợp lệ",
			400,
			"phone"
		);
	if (!password)
		return sendError(res, "Mật khẩu không được để trống", 400, "password");
	if (validate({ password }, passwordConstraint))
		return sendError(
			res,
			"Mật khẩu phải dài ít nhất 8 ký tự và phải chứa ít nhất một chữ thường, một chữ in hoa, một số và một ký tự đặc biệt",
			400,
			"password"
		);
	if (!confirmPassword)
		return sendError(
			res,
			"Xác nhận mật khẩu không được để trống",
			400,
			"confirmPassword"
		);
	if (confirmPassword !== password)
		return sendError(
			res,
			"Xác nhận mật khẩu không bằng mật khẩu",
			400,
			"confirmPassword"
		);
	if (!address)
		return sendError(res, "Địa chỉ không được để trống", 400, "address");
	if (!activeCode)
		return sendError(res, "Mã xác thực không được để trống", 400, "activeCode");

	try {
		// Check code exists or not in database
		const isCodeExist = await TempData.findOne({ email });
		if (isCodeExist.activeCode !== activeCode)
			return sendError(
				res,
				"Mã xác thực không tồn tại hoặc đã hết hạn",
				404,
				"activeCode"
			);

		// Check email exists or not in database
		const isEmailExists = await User.findOne({ email });
		if (isEmailExists)
			return sendError(
				res,
				`Email (${isEmailExists.email}) đã tồn tại`,
				409,
				"email"
			);
		// Check phone exists or not in database
		const isPhoneExists = await User.findOne({ phone });
		if (isPhoneExists)
			return sendError(
				res,
				`Số điện thoại (${isPhoneExists.phone}) đã tồn tại`,
				409,
				"phone"
			);

		// Hash password
		const hashedPassword = await hashPassword(password);

		let newUser;
		// Check file exists or not
		if (file) {
			const { path } = file;

			await cloudinary.uploader
				.upload(path, avatarOptions)
				.then(async (result) => {
					// Create a new user with avatar
					newUser = new User({
						...req.body,
						password: hashedPassword,
						avatar: result.secure_url,
					});
				});
		} else {
			// Create a new user
			newUser = new User({ ...req.body, password: hashedPassword });
		}
		await newUser.save();

		// Send success notification
		return sendSuccess(res, "Đăng ký tài khoản thành công", null, 201);
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	// Get data from request body
	const { email, password, phone } = req.body;

	// Validate auth
	if (!email && !phone)
		return sendError(
			res,
			"Email hoặc số điện thoại không được để trống",
			400,
			"emailOrPhone"
		);
	if (!password)
		return sendError(res, "Mật khẩu không được để trống", 400, "password");

	try {
		// Check email or phone does not exists in database
		const isEmailOrPhoneExists = await User.findOne({
			$or: [{ email }, { phone }],
		});
		if (!isEmailOrPhoneExists)
			return sendError(
				res,
				"Người dùng không tồn tại với email hoặc số điện thoại được cung cấp",
				400,
				"emailOrPhone"
			);

		// Compare password
		const isMatchPassword = bcrypt.compareSync(
			password,
			isEmailOrPhoneExists.password
		);
		// Check if the password entered by the user does not match the password in the database
		if (!isMatchPassword)
			return sendError(res, "Mật khẩu bạn đã nhập không đúng", 400, "password");

		// Get token secret from .env file
		const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
		const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

		// Generate JWT access token
		const accessToken = jwt.sign(
			{ userId: isEmailOrPhoneExists._id },
			ACCESS_TOKEN_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXPIRES_IN }
		);
		// Generate JWT refresh token
		const refreshToken = jwt.sign(
			{ userId: isEmailOrPhoneExists._id },
			REFRESH_TOKEN_SECRET,
			{ expiresIn: REFRESH_TOKEN_EXPIRES_IN }
		);

		// Set access token in response headers
		res.setHeader("authorization", `Bearer ${accessToken}`);

		// Set refresh token in response cookies
		res.cookie("refreshToken", refreshToken);

		// Initial current ip
		const currentIP = ip.address();

		// Update user
		await User.findByIdAndUpdate(
			isEmailOrPhoneExists._id,
			{
				loggedInAt: moment().format(formatDateTime),
				loggedInIP: currentIP,
			},
			{ new: true }
		);

		// Get user after updated
		const userUpdated = await User.findById(isEmailOrPhoneExists._id).select(
			"-__v -password"
		);

		// Send success notification
		return sendSuccess(res, "Đăng nhập thành công", {
			accessToken,
			refreshToken,
			user: userUpdated,
		});
	} catch (error) {
		next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		// Clear refresh token cookie for the client
		res.clearCookie("refreshToken");

		// Clear access token and refresh by setting the Authorization header to an empty string
		res.setHeader("authorization", "");

		// Send success notification
		return sendSuccess(res, "Đăng xuất thành công");
	} catch (error) {
		next(error);
	}
};

export const forgotPassword = async (req, res, next) => {
	// Get data from request body
	const { email } = req.body;
	// New password
	const newPassword = generateRandomCode();

	// Validate
	if (!email) return sendError(res, "Email không được để trống", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email không phải là một email hợp lệ", 400, "email");

	try {
		// Check email exists or not in database
		const isEmailExists = await User.findOne({ email });
		if (!isEmailExists)
			return sendError(res, `Email không tồn tại`, 404, "email");

		// Hash password
		const hashedNewPassword = await hashPassword(newPassword);

		// Update user with new hashed password
		await User.findByIdAndUpdate(
			isEmailExists._id,
			{ password: hashedNewPassword },
			{ new: true }
		);

		// Create transport
		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "hoangsang.nguyen2001a@gmail.com",
				pass: "znloocntppwxygnr",
			},
		});

		const mailOptions = {
			from: "hoangsang.nguyen2001a@gmail.com",
			to: email,
			subject: "Forgot Password",
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
																<p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hi ${email},</p>
																<table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%;" width="100%">
																	<tbody>
																		<tr>
																			<td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
																				<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
																					<tbody>
																						<tr>
																							<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; padding: 10px; text-align: center; background-color: #FFC26D;" valign="top" align="center" bgcolor="#FFC26D">
																								Looks like you have forgotten your password. Please click the link below to choose a new one.
																							</td>
																						</tr>
																						<br/>
																						<tr>
																						<td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; padding: 10px; text-align: center; background-color: #FFC26D;" valign="top" align="center" bgcolor="#FFC26D">
																							New password: ${newPassword}
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

		// Send success notification
		return sendSuccess(
			res,
			"Đã gửi mật khẩu tới email. Vui lòng kiểm tra hộp thư đến email của bạn."
		);
	} catch (error) {
		next(error);
	}
};