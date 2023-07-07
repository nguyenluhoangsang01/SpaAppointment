export const formatPrice = (value) => {
	const formatter = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	});

	return formatter.format(value).replace("₫", "VND");
};

export const convertPathname = (pathname) => {
	const str = pathname?.replace("-", " ").replace("/", "");
	return str?.charAt(0).toUpperCase() + str?.slice(1);
};

export const sizeInMb = (bytes) => {
	return `${bytes.toLocaleString("en-US").replaceAll(",", ".")} byte${
		bytes > 1 && "s"
	}`;
};

export const axiosConfig = (accessToken, refreshToken) => {
	return {
		headers: {
			authorization: `Bearer ${accessToken}`,
			Cookies: `refreshToken=${refreshToken}`,
		},
	};
};

export const axiosConfigFormData = (accessToken, refreshToken) => {
	return {
		headers: {
			authorization: `Bearer ${accessToken}`,
			Cookies: `refreshToken=${refreshToken}`,
			"Content-Type": "multipart/form-data",
		},
	};
};

export const converDatetime = (datetime) => {
	const year = datetime.slice(0, 4);
	const month = datetime.slice(5, 7);
	const day = datetime.slice(8, 10);
	const hour = datetime.slice(11, 13);
	const minute = datetime.slice(14, 16);

	return `${hour}:${minute} - ${day}/${month}/${year}`;
};