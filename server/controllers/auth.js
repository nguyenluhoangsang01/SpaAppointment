import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import ip from "ip";
import jwt from "jsonwebtoken";
import moment from "moment";
import {
	ACCESS_TOKEN_EXPIRES_IN,
	avatarOptions,
	formatDateTime,
	REFRESH_TOKEN_EXPIRES_IN,
} from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const register = async (req, res, next) => {
	// Get data from request body
	const { password } = req.body;
	// Get file from request
	const { file } = req;

	try {
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