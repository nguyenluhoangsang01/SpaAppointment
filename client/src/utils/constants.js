import { lazy } from "react";

const Appointment = lazy(() => import("../views/Appointment"));
const ChangePassword = lazy(() => import("../views/ChangePassword"));
const GiftCard = lazy(() => import("../views/GiftCard"));
const GiftCardCreate = lazy(() => import("../views/GiftCard/GiftCardCreate"));
const GiftCardViewDetails = lazy(() =>
	import("../views/GiftCard/GiftCardViewDetails")
);
const GiftCardUpdate = lazy(() => import("../views/GiftCard/GiftCardUpdate"));
const Home = lazy(() => import("../views/Home"));
const NotFound = lazy(() => import("../views/NotFound"));
const Profile = lazy(() => import("../views/Profile"));
const Promotion = lazy(() => import("../views/Promotion"));
const PromotionCreate = lazy(() =>
	import("../views/Promotion/PromotionCreate")
);
const PromotionViewDetails = lazy(() =>
	import("../views/Promotion/PromotionViewDetails")
);
const PromotionUpdate = lazy(() =>
	import("../views/Promotion/PromotionUpdate")
);
const Review = lazy(() => import("../views/Review"));
const Service = lazy(() => import("../views/Service"));
const ServiceCreate = lazy(() => import("../views/Service/ServiceCreate"));
const ServiceViewDetails = lazy(() =>
	import("../views/Service/ServiceViewDetails")
);
const ServiceUpdate = lazy(() => import("../views/Service/ServiceUpdate"));
const SignIn = lazy(() => import("../views/SignIn"));
const SignUp = lazy(() => import("../views/SignUp"));
const Transaction = lazy(() => import("../views/Transaction"));
const User = lazy(() => import("../views/User"));
const UserViewDetails = lazy(() => import("../views/User/UserViewDetails"));
const UserUpdate = lazy(() => import("../views/User/UserUpdate"));

export const ROLES = {
	Admin: "Admin",
	Staff: "Staff",
	Customer: "Customer",
	Receptionist: "Receptionist",
};

export const SELECT_ROLES = [
	{
		value: "Admin",
		label: "Admin",
	},
	{
		value: "Staff",
		label: "Staff",
	},
	{
		value: "Customer",
		label: "Customer",
	},
	{
		value: "Receptionist",
		label: "Receptionist",
	},
];

export const SELECT_TYPES = [
	{
		value: "Percentage",
		label: "Percentage",
	},
	{
		value: "Fixed",
		label: "Fixed",
	},
];

export const SELECT_STATUS = [
	{
		value: "Active",
		label: "Active",
	},
	{
		value: "Inactive",
		label: "Inactive",
	},
];

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
		path: "/gift-cards/create",
		element: <GiftCardCreate />,
	},
	{
		path: "/gift-cards/:id/view-details",
		element: <GiftCardViewDetails />,
	},
	{
		path: "/gift-cards/:id/update",
		element: <GiftCardUpdate />,
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
		path: "/promotions/:id/view-details",
		element: <PromotionViewDetails />,
	},
	{
		path: "/promotions/:id/update",
		element: <PromotionUpdate />,
	},
	{
		path: "/promotions/create",
		element: <PromotionCreate />,
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
	{
		path: "/users/:id/view-details",
		element: <UserViewDetails />,
	},
	{
		path: "/users/:id/update",
		element: <UserUpdate />,
	},
	{
		path: "/services/create",
		element: <ServiceCreate />,
	},
	{
		path: "/services/:id/view-details",
		element: <ServiceViewDetails />,
	},
	{
		path: "/services/:id/update",
		element: <ServiceUpdate />,
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

export const formatDateTime = "HH:mm - DD/MM/YYYY";