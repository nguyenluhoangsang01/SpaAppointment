import React from "react";

const Footer = () => {
	const date = new Date();
	const fullYear = date.getFullYear();

	return (
		<footer className="h-14 bg-[#000] text-white flex items-center justify-center text-[14px]">
			© Copyright {fullYear} sang.197ct22513@vanlanguni.vn. All rights reserved
		</footer>
	);
};

export default Footer;