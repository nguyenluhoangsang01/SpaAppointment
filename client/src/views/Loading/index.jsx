import { Image } from "antd";
import React from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Loading = () => {
	return (
		<>
			<Navbar />

			<div className="mx-auto px-6 md:px-10 max-w-full pt-[56px] min-h-[calc(100vh-56px)]">
				<div className="py-6">
					<Image
						src="https://assets-global.website-files.com/5c7fdbdd4e3feeee8dd96dd2/6134707265a929f4cdfc1f6d_5.gif"
						alt="Loading..."
						className="w-full h-full object-cover"
						preview={false}
					/>
				</div>
			</div>

			<Footer />
		</>
	);
};

export default Loading;