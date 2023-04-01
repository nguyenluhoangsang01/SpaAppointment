import React from "react";
import { useParams } from "react-router-dom";

const Heading = ({ children }) => {
	// Get id from params
	const { id } = useParams();

	return (
		<h1
			className={`font-bold uppercase mb-8 text-2xl ${
				id ? "hidden" : "block"
			}`}
		>
			{children.split("/").length > 1 ? children.split("/")[1] : children}
		</h1>
	);
};

export default Heading;