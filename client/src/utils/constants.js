import { lazy } from "react";

const Appointment = lazy(() => import("../views/Appointment"));
const ChangePassword = lazy(() => import("../views/ChangePassword"));
const GiftCard = lazy(() => import("../views/GiftCard"));
const Home = lazy(() => import("../views/Home"));
const NotFound = lazy(() => import("../views/NotFound"));
const Profile = lazy(() => import("../views/Profile"));
const Promotion = lazy(() => import("../views/Promotion"));
const Review = lazy(() => import("../views/Review"));
const Service = lazy(() => import("../views/Service"));
const SignIn = lazy(() => import("../views/SignIn"));
const SignUp = lazy(() => import("../views/SignUp"));
const Transaction = lazy(() => import("../views/Transaction"));
const User = lazy(() => import("../views/User"));

export const ROLES = {
	Admin: "Admin",
	Staff: "Staff",
	Customer: "Customer",
	Receptionist: "Receptionist",
};

export const routes = [
	{
		path: "/appointments",
		element: <Appointment />,
	},
	{
		path: "/change-password",
		element: <ChangePassword />,
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
		path: "/",
		name: "Home",
	},
	{
		path: "/appointments",
		name: "Appointments",
	},
	{
		path: "/services",
		name: "Services",
	},
	{
		path: "/promotions",
		name: "Promotions",
	},
	{
		path: "/gift-cards",
		name: "Gift cards",
	},
	{
		path: "/reviews",
		name: "Reviews",
	},
	{
		path: "/users",
		name: "Users",
	},
];

export const authRoutes = [
	{
		path: "/sign-up",
		name: "Sign up",
	},
	{
		path: "/sign-in",
		name: "Sign in",
	},
];

export const accountRoutes = [
	{
		path: "/profile",
		name: "Profile",
	},
	{
		path: "/change-password",
		name: "Change password",
	},
	{
		path: "/transactions",
		name: "Transaction",
	},
	{
		path: "",
		name: "Sign out",
	},
];

export const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 8,
	},
};
export const tailLayout = {
	wrapperCol: {
		offset: 3,
		span: 16,
	},
};

export const phoneRegex =
	/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/;