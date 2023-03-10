const generateRandomCode = () => {
	let string = "";
	const maxLength = 13;
	const max = 90;
	const min = 65;

	for (let index = 0; index < maxLength; index++) {
		const getRandomArbitrary = Math.random() * (max - min) + min;

		string = string + String.fromCharCode(getRandomArbitrary);
	}

	return string;
};

export default generateRandomCode;