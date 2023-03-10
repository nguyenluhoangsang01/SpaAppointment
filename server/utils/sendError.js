const sendError = (res, errors, statusCode = 400, name) => {
	let resJson = {
		success: false,
		status: statusCode,
		errors,
	};

	if (name) resJson.name = name;

	return res.status(statusCode).json(resJson);
};

export default sendError;