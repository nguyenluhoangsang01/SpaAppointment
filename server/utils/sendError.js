const sendError = (res, message, statusCode = 400, name) => {
	let resJson = {
		success: false,
		status: statusCode,
		message,
	};

	if (name) resJson.name = name;

	return res.status(statusCode).json(resJson);
};

export default sendError;