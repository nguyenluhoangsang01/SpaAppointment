import User from "../models/User.js";
import hashPassword from "../utils/hashPassword.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";
import { v2 as cloudinary } from "cloudinary";

export const create = async (req, res, next) => {
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
    sendSuccess(res, "User created successfully", null, 201);
  } catch (error) {
    next(error);
  }
};