import User from "../models/User.js";
import sendError from "../utils/sendError.js";

const verifyAdmin = async (req, res, next) => {
	try {
		// Get user if from request
		const { userId } = req;

		// Get user by user id
		const user = await User.findById(userId);
		// Check if user does not exist
		if (!user) return sendError(res, "User not found", 404);

		// Check if user's role isn't admin
		if (user.role !== "Admin")
			return sendError(
				res,
				"Access to this resource on the server is denied",
				403
			);

		next();
	} catch (error) {
		next(error);
	}
};

export default verifyAdmin;