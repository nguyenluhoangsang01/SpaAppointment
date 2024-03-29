import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Default = () => {
	// Router
	const navigate = useNavigate();
	const { pathname } = useLocation();

	return (
		<>
			<Navbar />

			<main className="mx-auto px-6 md:px-10 max-w-full pt-[56px] min-h-[calc(100vh-56px)]">
				<div className="py-6">
					{pathname !== "/" && (
						<div className="flex items-center justify-between w-full">
							{pathname !== "/sign-in" &&
								pathname !== "/sign-up" &&
								pathname !== "/forgot-password" && (
									<div
										className="text-sm italic underline cursor-pointer flex items-center gap-2 mb-8"
										onClick={() => navigate(-1)}
									>
										<BiArrowBack />
										<span>Quay về trang trước</span>
									</div>
								)}
						</div>
					)}

					<Outlet />
				</div>
			</main>

			<Footer />
		</>
	);
};

export default Default;