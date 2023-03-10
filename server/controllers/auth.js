import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import ip from "ip";
import jwt from "jsonwebtoken";
import moment from "moment";
import { formatTime } from "../constants.js";
import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

// Constants
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const register = async (req, res, next) => {
	try {
		// Get data from request body
		const { email, password, phone } = req.body;
		// Get file from request
		const { file } = req;

		// Check email exists or not in database
		const isEmailExists = await User.findOne({ email });
		if (isEmailExists)
			return sendError(
				res,
				"User with this email already exists",
				409,
				"email"
			);
		// Check phone exists or not in database
		const isPhoneExists = await User.findOne({ phone });
		if (isPhoneExists)
			return sendError(
				res,
				"User with this phone number already exists",
				409,
				"phone"
			);

		// Hash password
		const hashedPassword = await hashPassword(password);

		let newUser;
		// Check file exists or not
		if (file) {
			const imagePath = file.path;
			const options = {
				folder: "avatar",
				unique_filename: true,
				resource_type: "image",
				use_filename: true,
				overwrite: true,
			};

			await cloudinary.uploader
				.upload(imagePath, options)
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
				"User does not exist with the provided email or phone number"
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
		isEmailOrPhoneExists.refreshToken = refreshToken;
		await isEmailOrPhoneExists.save();

		// Send HTTP-only cookie
		res.cookie("accessToken", accessToken);
		res.cookie("refreshToken", refreshToken);

		// Initial current ip
		const currentIP = ip.address();

		// Update user
		await User.findByIdAndUpdate(
			isEmailOrPhoneExists._id,
			{
				loggedInAt: moment().format(formatTime),
				loggedInIP: currentIP,
			},
			{ new: true }
		);

		// Send success notification
		return sendSuccess(res, "User logged successfully", {
			accessToken,
			refreshToken,
		});
	} catch (error) {
		next(error);
	}
};