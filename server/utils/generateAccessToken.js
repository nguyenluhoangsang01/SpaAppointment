import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (refreshToken) => {
	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, user) => {
		if (error)
			return sendError(
				res,
				"Refresh token has expired or is otherwise invalid",
				498
			);

		const accessToken = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET, {
			expiresIn: "15m",
		});

		return accessToken;
	});
};

export default generateAccessToken;