import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
	return (
		<div className="relative h-screen">
			<Navbar />

			<div className="px-4 sm:px-10 pt-[70px] pb-[20px] font-[calibri] w-full">
				<p className="text-[red] text-[20px] font-semibold">
					Something went wrong:
				</p>

				<pre className="my-4">{error.message}</pre>

				<button
					onClick={resetErrorBoundary}
					className="pt-[8px] pr-[10px] pb-[5px] pl-[9px] bg-[#333] text-[#fff] cursor-pointer text-[14px] select-none rounded-md font-[calibri] hover:scale-105 active:scale-100 transition"
				>
					Try again
				</button>
			</div>

			<div className="absolute w-full bottom-0">
				<Footer />
			</div>
		</div>
	);
};

export default ErrorFallback;