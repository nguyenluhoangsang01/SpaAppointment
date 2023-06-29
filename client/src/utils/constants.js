import { lazy } from "react";

const Appointment = lazy(() => import("../views/Appointment"));
const AppointmentView = lazy(() =>
	import("../views/Appointment/AppointmentView")
);
const AppointmentViewDetails = lazy(() =>
	import("../views/Appointment/AppointmentViewDetails")
);
const AppointmentUpdate = lazy(() =>
	import("../views/Appointment/AppointmentUpdate")
);
const ChangePassword = lazy(() => import("../views/ChangePassword"));
const ForgotPassword = lazy(() => import("../views/ForgotPassword"));
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
const Service = lazy(() => import("../views/Service"));
const ServiceCreate = lazy(() => import("../views/Service/ServiceCreate"));
const ServiceViewDetails = lazy(() =>
	import("../views/Service/ServiceViewDetails")
);
const ServiceUpdate = lazy(() => import("../views/Service/ServiceUpdate"));
const Location = lazy(() => import("../views/Location"));
const LocationCreate = lazy(() => import("../views/Location/LocationCreate"));
const LocationViewDetails = lazy(() =>
	import("../views/Location/LocationViewDetails")
);
const LocationUpdate = lazy(() => import("../views/Location/LocationUpdate"));
const SignIn = lazy(() => import("../views/SignIn"));
const SignUp = lazy(() => import("../views/SignUp"));
const User = lazy(() => import("../views/User"));
const UserViewDetails = lazy(() => import("../views/User/UserViewDetails"));
const UserUpdate = lazy(() => import("../views/User/UserUpdate"));
const Schedule = lazy(() => import("../views/Schedule"));
const ScheduleView = lazy(() => import("../views/Schedule/ScheduleView"));
const ScheduleViewDetails = lazy(() =>
	import("../views/Schedule/ScheduleViewDetails")
);
const ScheduleUpdate = lazy(() => import("../views/Schedule/ScheduleUpdate"));
const Statistical = lazy(() => import("../views/Statistical"));
const Notification = lazy(() => import("../views/Notification"));

export const ROLES = {
	"Quản trị viên": "Quản trị viên",
	"Khách hàng": "Khách hàng",
};

export const SELECT_ROLES = [
	{
		value: "Quản trị viên",
		label: "Quản trị viên",
	},
	{
		value: "Nhân viên",
		label: "Nhân viên",
	},
	{
		value: "Khách hàng",
		label: "Khách hàng",
	},
];

export const SELECT_TYPES = [
	{
		value: "Tỷ lệ phần trăm",
		label: "Tỷ lệ phần trăm",
	},
	{
		value: "Tỷ lệ cố định",
		label: "Tỷ lệ cố định",
	},
];

export const SELECT_TYPES_SCHEDULE = [
	{
		value: "Đang làm việc",
		label: "Đang làm việc",
	},
	{
		value: "Đang nghỉ việc",
		label: "Đang nghỉ việc",
	},
];

export const SELECT_STATUS = [
	{
		value: "Đang hoạt động",
		label: "Đang hoạt động",
	},
	{
		value: "Chưa hoạt động",
		label: "Chưa hoạt động",
	},
];

export const SELECT_APPOINTMENT_STATUS = [
	{
		value: "Đã đặt",
		label: "Đã đặt",
	},
	{
		value: "Đã hủy",
		label: "Đã hủy",
	},
	{
		value: "Đã hoàn thành",
		label: "Đã hoàn thành",
	},
	{
		value: "Đã xác nhận",
		label: "Đã xác nhận",
	},
];

export const routes = [
	{
		path: "/appointments",
		element: <Appointment />,
	},
	{
		path: "/appointments/view-appointments",
		element: <AppointmentView />,
	},
	{
		path: "/appointments/:id/view-details",
		element: <AppointmentViewDetails />,
	},
	{
		path: "/appointments/view-appointments/:id/update",
		element: <AppointmentUpdate />,
	},
	{
		path: "/appointments/:id/update",
		element: <AppointmentUpdate />,
	},
	{
		path: "/change-password",
		element: <ChangePassword />,
	},
	{
		path: "/forgot-password",
		element: <ForgotPassword />,
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
	{
		path: "/locations",
		element: <Location />,
	},
	{
		path: "/locations/create",
		element: <LocationCreate />,
	},
	{
		path: "/locations/:id/view-details",
		element: <LocationViewDetails />,
	},
	{
		path: "/locations/:id/update",
		element: <LocationUpdate />,
	},
	{
		path: "/schedule",
		element: <Schedule />,
	},
	{
		path: "/schedule/view-schedule",
		element: <ScheduleView />,
	},
	{
		path: "/schedule/:id/view-details",
		element: <ScheduleViewDetails />,
	},
	{
		path: "/schedule/view-schedule/:id/update",
		element: <ScheduleUpdate />,
	},
	{
		path: "/schedule/:id/update",
		element: <ScheduleUpdate />,
	},
	{
		path: "/statistical",
		element: <Statistical />,
	},
	{
		path: "/notification",
		element: <Notification />,
	},
];

export const navbarRoutes = [
	{
		path: "/",
		name: "Trang chủ",
	},
	{
		path: "/appointments",
		name: "Cuộc hẹn",
	},
	{
		path: "/services",
		name: "Dịch vụ",
	},
	{
		path: "/locations",
		name: "Địa điểm",
	},
	{
		path: "/promotions",
		name: "Khuyến mãi",
	},
	{
		path: "/gift-cards",
		name: "Thẻ quà tặng",
	},
	{
		path: "/users",
		name: "Người dùng",
	},
];

export const authRoutes = [
	{
		path: "/sign-up",
		name: "Đăng ký",
	},
	{
		path: "/sign-in",
		name: "Đăng nhập",
	},
];

export const accountRoutes = [
	{
		path: "/notification",
		name: "Thông báo",
	},
	{
		path: "/profile",
		name: "Hồ sơ người dùng",
	},
	{
		path: "/schedule",
		name: "Lịch trình",
	},
	{
		path: "/statistical",
		name: "Thống kê",
	},
	{
		path: "/change-password",
		name: "Đổi mật khẩu",
	},
	{
		path: "",
		name: "Đăng xuất",
	},
];

export const layout = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 24,
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
