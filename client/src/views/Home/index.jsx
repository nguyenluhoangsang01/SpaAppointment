import { Button, Image } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	// Router
	const navigate = useNavigate();

	return (
		<div className="bg-[#F7C0C3]">
			<div className="flex items-center justify-between">
				<Image
					src="https://www.salonmanagementapp.com/assets/img/hero.png"
					alt="bg"
					preview={false}
				/>

				<div className="flex items-center flex-col justify-center gap-16">
					<h1 className="uppercase text-8xl text-center tracking-widest">
						spa appointment
					</h1>

					<Button
						className="bg-white"
						onClick={() => navigate("/appointments")}
					>
						Make an appointment now
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Home;