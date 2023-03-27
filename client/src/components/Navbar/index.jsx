import { Image } from "antd";
import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { navbarRoutes } from "../../utils/constants";

const Navbar = () => {
	// State
	const [isShowMenu, setIsShowMenu] = useState(false);
	// Redux
	const { user } = useSelector(selectAuth);

	return (
		<nav className="h-14 bg-[#EAB0C2] w-full z-50 shadow fixed md:flex md:items-center md:justify-between">
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
				className={`w-3/5 h-full md:flex md:items-center ${
					isShowMenu
						? "flex flex-col items-center justify-center w-full bg-[#EAB0C2] border-t-2"
						: "hidden md:flex"
				}`}
			>
				{navbarRoutes
					.filter((route) =>
						user ? route.name !== "Sign in" && route.name !== "Sign up" : route
					)
					.map((route) => (
						<NavLink
							key={route.name}
							to={route.path}
							className={({ isActive }) =>
								`h-[40px] md:h-full flex items-center justify-center hover:bg-[#FFFFFF] w-full transition md:px-2 ${
									isActive ? "bg-[#FFFFFF]" : ""
								}`
							}
						>
							<li>{route.name}</li>
						</NavLink>
					))}
			</ul>
		</nav>
	);
};

export default Navbar;