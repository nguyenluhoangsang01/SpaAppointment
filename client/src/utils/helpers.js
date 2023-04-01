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