import sendError from "../utils/sendError.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

	try {
		// Get authorization from request headers
		const authorization = req.headers.authorization;
		// Get refresh token from authorization
		const refreshToken = authorization?.split(" ")[1];

		// Check if refresh token does not exist
		if (!refreshToken)
			return sendError(res, "You are not authenticated, please login", 401);

		// Verify refresh token
		jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
			if (error)
				return sendError(
					res,
					"Refresh token has expired or is otherwise invalid",
					498
				);

			// Set userId to request
			req.userId = decoded.userId;

			next();
		});
	} catch (error) {
		next(error);
	}
};

export default verifyToken;