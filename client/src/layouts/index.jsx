import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
	return (
		<>
			<Navbar />

			<main className="mx-auto px-6 md:px-10 max-w-full pt-[56px] min-h-[calc(100vh-56px)]">
				<div className="py-6">
					<Outlet />
				</div>
			</main>

			<Footer />
		</>
	);
};

export default Default;