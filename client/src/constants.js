import { lazy } from "react";

const Appointment = lazy(() => import("./views/Appointment"));
const GiftCard = lazy(() => import("./views/GiftCard"));
const Home = lazy(() => import("./views/Home"));
const NotFound = lazy(() => import("./views/NotFound"));
const Profile = lazy(() => import("./views/Profile"));
const Promotion = lazy(() => import("./views/Promotion"));
const Review = lazy(() => import("./views/Review"));
const Service = lazy(() => import("./views/Service"));
const SignIn = lazy(() => import("./views/SignIn"));
const SignUp = lazy(() => import("./views/SignUp"));
const Transaction = lazy(() => import("./views/Transaction"));
const User = lazy(() => import("./views/User"));

export const routes = [
	{
		path: "/appointments",
		element: <Appointment />,
	},
	{
		path: "/gift-cards",
		element: <GiftCard />,
	},
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/*",
		element: <NotFound />,
	},
	{
		path: "/profile",
		element: <Profile />,
	},
	{
		path: "/promotions",
		element: <Promotion />,
	},
	{
		path: "/reviews",
		element: <Review />,
	},
	{
		path: "/services",
		element: <Service />,
	},
	{
		path: "/sign-in",
		element: <SignIn />,
	},
	{
		path: "/sign-up",
		element: <SignUp />,
	},
	{
		path: "/transactions",
		element: <Transaction />,
	},
	{
		path: "/users",
		element: <User />,
	},
];

export const navbarRoutes = [
	{
		path: "/appointments",
		name: "Appointment",
	},
	{
		path: "/gift-cards",
		name: "Gift card",
	},
	{
		path: "/",
		name: "Home",
	},
	{
		path: "/promotions",
		name: "Promotion",
	},
	{
		path: "/reviews",
		name: "Review",
	},
	{
		path: "/services",
		name: "Service",
	},
	{
		path: "/sign-in",
		name: "SignIn",
	},
	{
		path: "/sign-up",
		name: "SignUp",
	},
	{
		path: "/users",
		name: "User",
	},
];

export const accountRoutes = [
	{
		path: "/profile",
		name: "Profile",
	},
	{
		path: "/transactions",
		name: "Transaction",
	},
	{
		path: "",
		name: "Log out",
	},
];