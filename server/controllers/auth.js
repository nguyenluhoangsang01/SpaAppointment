import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import ip from "ip";
import jwt from "jsonwebtoken";
import moment from "moment";
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
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const register = async (req, res, next) => {
	// Get file from request
	const { file } = req;
	// Get data from request body
	const {
		address,
		confirmPassword,
		email,
		firstName,
		lastName,
		password,
		phone,
	} = req.body;

	if (!firstName)
		return sendError(res, "First name can't be blank", 400, "firstName");
	if (!lastName)
		return sendError(res, "Last name can't be blank", 400, "lastName");
	if (!email) return sendError(res, "Email can't be blank", 400, "email");
	if (validate({ email }, emailConstraint))
		return sendError(res, "Email isn't a valid email", 400, "email");
	if (!phone)
		return sendError(res, "Phone number can't be blank", 400, "phone");
	if (validate({ phone }, phoneConstraint))
		return sendError(res, "Phone must be a valid phone number", 400, "phone");
	if (!password)
		return sendError(res, "Password can't be blank", 400, "password");
	if (validate({ password }, passwordConstraint))
		return sendError(
			res,
			"Password should be at least 8 characters long and must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
			400,
			"password"
		);
	if (!confirmPassword)
		return sendError(
			res,
			"Confirm password can't be blank",
			400,
			"confirmPassword"
		);
	if (confirmPassword !== password)
		return sendError(
			res,
			"Confirm password isn't equal to password",
			400,
			"confirmPassword"
		);
	if (!address) return sendError(res, "Address can't be blank", 400, "address");

	try {
		// Check email exists or not in database
		const isEmailExists = await User.findOne({ email });
		if (isEmailExists)
			return sendError(
				res,
				`User with this email (${isEmailExists.email}) already exists`,
				409,
				"email"
			);
		// Check phone exists or not in database
		const isPhoneExists = await User.findOne({ phone });
		if (isPhoneExists)
			return sendError(
				res,
				`User with this phone number (${isPhoneExists.phone}) already exists`,
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
		return sendSuccess(res, "User created successfully", null, 201);
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
			"Email or phone number can't be blank",
			400,
			"emailOrPhone"
		);
	if (!password)
		return sendError(res, "Password can't be blank", 400, "password");

	try {
		// Check email or phone does not exists in database
		const isEmailOrPhoneExists = await User.findOne({
			$or: [{ email }, { phone }],
		});
		if (!isEmailOrPhoneExists)
			return sendError(
				res,
				"User does not exist with the provided email or phone number",
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
			return sendError(
				res,
				"Sorry, the password you entered is incorrect. Please try again",
				400,
				"password"
			);

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
		return sendSuccess(res, "User logged successfully", {
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
		return sendSuccess(res, "Logged out successfully");
	} catch (error) {
		next(error);
	}
};