import { Image } from "antd";
import React from "react";
import { AiOutlineInfoCircle, AiOutlinePhone } from "react-icons/ai";

const Footer = () => {
	const date = new Date();
	const fullYear = date.getFullYear();

	return (
		<footer className="bg-[#000] text-white px-10 py-8 flex items-center justify-between">
			<div className="flex flex-col">
				<div className="flex items-center justify-center">
					<Image
						src="https://res.cloudinary.com/spaappointment/image/upload/v1679556095/logo_k6ldwj-removebg-preview_mzl1cn.png"
						alt="Spa Appointment App"
						preview={false}
						width={100}
						height={100}
					/>
					<h3 className="text-xl tracking-wider">Spa Appointment</h3>
				</div>
			</div>

			<div className="h-14 bg-[#000] text-white flex items-center justify-center text-[14px]">
				© Copyright {fullYear} sang.197ct22513@vanlanguni.vn. All rights
				reserved
			</div>

			<ul>
				<li className="text-xl mb-2">
					<h3>Liên hệ</h3>
				</li>
				<li>
					<a
						href="mailto:sang.197ct22513@vanlanguni.vn"
						className="flex items-center gap-2"
					>
						<AiOutlineInfoCircle />
						<span>sang.197ct22513@vanlanguni.vn</span>
					</a>
				</li>
				<li>
					<a href="tel:077689228" className="flex items-center gap-2">
						<AiOutlinePhone />
						<span>0776689228</span>
					</a>
				</li>
			</ul>
		</footer>
	);
};

export default Footer;