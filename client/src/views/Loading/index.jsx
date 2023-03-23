import { Image } from "antd";
import React from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const Loading = () => {
	return (
		<>
			<Navbar />

			<div className="h-screen flex items-center justify-center w-screen">
				<Image
					src="https://assets-global.website-files.com/5c7fdbdd4e3feeee8dd96dd2/6134707265a929f4cdfc1f6d_5.gif"
					alt="Loading..."
					className="w-full h-full object-cover"
					preview={false}
				/>
			</div>

			<Footer />
		</>
	);
};

export default Loading;