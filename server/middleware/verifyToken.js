import sendError from "../utils/sendError.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

	try {
		// Get authorization from request headers
		const authorization = req.headers.authorization;
		// Get access token from authorization
		const accessToken = authorization?.split(" ")[1];

		// Check if access token does not exist
		if (!accessToken)
			return sendError(res, "You are not authenticated, please login", 401);

		// Verify access token
		jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, decoded) => {
			if (error)
				return sendError(
					res,
					"Access token has expired or is otherwise invalid",
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