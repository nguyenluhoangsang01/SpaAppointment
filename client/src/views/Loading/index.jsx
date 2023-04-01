import { Image } from "antd";
import React from "react";

const Loading = () => {
	return (
		<div className="mx-auto h-screen w-screen flex items-center justify-center">
			<Image
				src="https://assets-global.website-files.com/5c7fdbdd4e3feeee8dd96dd2/6134707265a929f4cdfc1f6d_5.gif"
				alt="Loading..."
				className="w-full h-full object-cover"
				preview={false}
			/>
		</div>
	);
};

export default Loading;