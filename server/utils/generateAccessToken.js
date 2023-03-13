import jwt from "jsonwebtoken";
import sendError from "./sendError.js";

const generateAccessToken = (res, refreshToken) => {
	const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
	const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

	return new Promise((resolve, reject) => {
		jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, decoded) => {
			if (error) {
				reject(
					sendError(
						res,
						"Refresh token has expired or is otherwise invalid",
						498
					)
				);
			} else {
				const accessToken = jwt.sign(
					{ userId: decoded.userId },
					ACCESS_TOKEN_SECRET,
					{
						expiresIn: "15m",
					}
				);
				resolve(accessToken);
			}
		});
	});
};

export default generateAccessToken;