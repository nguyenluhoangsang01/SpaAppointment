import { Button, Image, Tooltip } from "antd";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { getAllUsersReducerAsync } from "../../redux/slice/user";

const Home = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

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

					<Tooltip title="Make an appointment now">
						<Button
							className="bg-white"
							onClick={() => navigate("/appointments")}
						>
							Tạo cuộc hẹn ngay bây giờ
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default Home;
