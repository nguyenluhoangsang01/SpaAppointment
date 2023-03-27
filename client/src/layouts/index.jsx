import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Heading from "../components/Heading";
import Navbar from "../components/Navbar";
import { convertPathname } from "../utils/helpers";

const Default = () => {
	const { pathname } = useLocation();

	return (
		<>
			<Navbar />

			<main className="mx-auto px-6 md:px-10 max-w-full pt-[56px] min-h-[calc(100vh-56px)]">
				<div className="py-6">
					<Heading>
						{convertPathname(pathname) !== ""
							? convertPathname(pathname)
							: "Home"}
					</Heading>

					<Outlet />
				</div>
			</main>

			<Footer />
		</>
	);
};

export default Default;