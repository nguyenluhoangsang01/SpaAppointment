import { Badge, Image } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { selectAppointment } from "../../redux/slice/appointment";
import { selectAuth, signOutReducer } from "../../redux/slice/auth";
import { accountRoutes, authRoutes, navbarRoutes } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";
import { useOutsideClick } from "../../utils/hooks";

const Navbar = () => {
	// State
	const [isShowMenu, setIsShowMenu] = useState(false);
	const [isClicked, setIsClicked] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { appointments } = useSelector(selectAppointment);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Custom hooks
	const handleUserDropdownClick = (e) => {
		e.stopPropagation();
		setIsClicked((prev) => !prev);
	};
	const handleClickOutSide = () => {
		setIsClicked(false);
	};
	const userDropdownRef = useOutsideClick(handleClickOutSide);

	useEffect(() => {
		window.addEventListener("keyup", (event) => {
			if (event.key === "Escape") {
				setIsClicked(false);
			}
		});
	}, []);

	const handleSignOut = async () => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/auth/logout",
				null,
				axiosConfig(accessToken, refreshToken)
			);
			if (data) {
				dispatch(signOutReducer(data));

				toast.success(data.message);

				setIsLoading(false);

				setIsClicked(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				toast.error(data.errors.system);

				setIsLoading(false);
			}
		}
	};

	const handleClickLink = () => {
		setIsClicked(false);
	};

	const lengthOfNotification = appointments?.filter(
		(appointment) =>
			appointment?.staff?._id === user?._id && appointment?.status === "Đã đặt"
	).length;

	return (
		<nav className="h-14 bg-[#000] w-full z-50 shadow fixed md:flex md:items-center md:justify-between text-white">
			<div className="px-10 flex items-center justify-between">
				<Link to="/">
					<Image
						src="https://res.cloudinary.com/spaappointment/image/upload/v1679556095/logo_k6ldwj-removebg-preview_mzl1cn.png"
						alt="Spa Appointment App"
						preview={false}
						width={50}
						height={50}
					/>
				</Link>

				<MdOutlineMenu
					className="text-2xl cursor-pointer hover:scale-105 active:scale-100 md:hidden"
					onClick={() => setIsShowMenu(!isShowMenu)}
				/>
			</div>

			<ul
				className={`h-full md:flex md:items-center md:justify-center ${
					isShowMenu
						? "flex flex-col items-center w-full bg-[#000] border-t-2"
						: "hidden md:flex"
				}`}
			>
				{navbarRoutes
					.filter((route) => user && route)
					.filter((route) =>
						user?.role !== "Quản trị viên" ? route.name !== "Người dùng" : route
					)
					.map((route) => (
						<NavLink
							key={route.name}
							to={route.path}
							className={({ isActive }) =>
								`h-[40px] md:h-full flex items-center justify-center hover:bg-[#FFFFFF] hover:text-black w-full transition md:px-2 ${
									isActive ? "bg-[#FFFFFF] text-black" : ""
								}`
							}
						>
							<li className="min-w-[100px] text-center">{route.name}</li>
						</NavLink>
					))}
			</ul>

			{user ? (
				<div>
					<div
						className="md:px-2 cursor-pointer font-bold uppercase text-sm gap-2 truncate hover:underline transition flex items-center justify-center"
						onClick={handleUserDropdownClick}
					>
						<Badge
							count={lengthOfNotification ? lengthOfNotification : 0}
							offset={[0, 8]}
							size="small"
							style={{
								backgroundColor: "#F7C0C3",
								color: "#000",
								fontWeight: 600,
							}}
						>
							<Image
								src={user.avatar}
								alt={`${user.firstName} ${user.lastName}`}
								preview={false}
								width={35}
								height={35}
								className="rounded-full"
							/>
						</Badge>

						<span className="flex items-center justify-center">
							{user.lastName}
						</span>
					</div>

					{isClicked && (
						<div
							ref={userDropdownRef}
							className="absolute top-[56px] right-0 flex flex-col bg-[#000] min-w-[200px]"
						>
							{accountRoutes
								.filter((route) =>
									user?.role === "Nhân viên" || user?.role === "Quản trị viên"
										? route
										: route.name !== "Lịch trình" && route.name !== "Thông báo"
								)
								.map((route) =>
									route.path !== "" ? (
										<Link
											key={route.name}
											to={route.path}
											className="hover:bg-white hover:text-black transition px-4 h-[40px] flex items-center"
											onClick={handleClickLink}
										>
											{route.name}
										</Link>
									) : (
										<button
											key={route.name}
											onClick={handleSignOut}
											className="px-4 flex items-center gap-2 hover:bg-white hover:text-black transition h-[40px]"
										>
											{isLoading && (
												<AiOutlineLoading3Quarters className="animate-spin" />
											)}
											<span>{route.name}</span>
										</button>
									)
								)}
						</div>
					)}
				</div>
			) : (
				<ul
					className={`h-full md:flex md:items-center md:justify-center ${
						isShowMenu
							? "flex flex-col items-center w-full bg-[#000] border-t-2"
							: "hidden md:flex"
					}`}
				>
					{authRoutes.map((route) => (
						<NavLink
							key={route.name}
							to={route.path}
							className={({ isActive }) =>
								`h-[40px] md:h-full flex items-center justify-center hover:bg-[#FFFFFF] hover:text-black w-full transition md:px-2 ${
									isActive ? "bg-[#FFFFFF] text-black" : ""
								}`
							}
						>
							<li className="min-w-[100px] text-center">{route.name}</li>
						</NavLink>
					))}
				</ul>
			)}
		</nav>
	);
};

export default Navbar;
