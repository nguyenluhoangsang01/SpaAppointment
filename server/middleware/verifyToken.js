import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken.js";
import sendError from "../utils/sendError.js";

const verifyToken = (req, res, next) => {
	const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
	const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

	try {
		// Get authorization from request headers
		const { authorization } = req.headers;
		// Get access token from authorization
		const accessToken = authorization?.split(" ")[1];
		// Get refresh token from cookies
		const { refreshToken } = req.cookies;

		// Check if access token and refresh token does not exists
		if (!accessToken && !refreshToken)
			return sendError(res, "Bạn chưa được xác thực, vui lòng đăng nhập", 401);

		// Verify access token
		jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, decoded) => {
			if (error) {
				// Verify refresh token
				jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
					if (error)
						return sendError(
							res,
							"Mã thông báo làm mới đã hết hạn hoặc không hợp lệ",
							498
						);

					// Generate new access token
					const newAccessToken = generateAccessToken(res, refreshToken);

					// Set new access token in response headers
					res.setHeader("authorization", `Bearer ${newAccessToken}`);

					// Set userId to request
					req.userId = decoded.userId;

					next();
				});
			} else {
				// Set userId to request
				req.userId = decoded.userId;

				next();
			}
		});
	} catch (error) {
		next(error);
	}
};

export default verifyToken;