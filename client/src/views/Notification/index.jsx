import { Table } from "antd";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAppointment } from "../../redux/slice/appointment";
import { selectAuth } from "../../redux/slice/auth";
import { getAllScheduleReducerAsync } from "../../redux/slice/schedule";

const Notification = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { appointments } = useSelector(selectAppointment);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Nhân viên" && user?.role !== "Quản trị viên") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		dispatch(getAllScheduleReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const columns = [
		{
			title: "Khách hàng",
			dataIndex: "user",
			key: "user",
			render: (text) => (
				<span>
					{text?.firstName} {text?.lastName}
				</span>
			),
		},
		{
			title: "Số điện thoại",
			dataIndex: "user",
			key: "user",
			render: (text) => <span>{text?.phone}</span>,
		},
		{
			title: "Email",
			dataIndex: "user",
			key: "user",
			render: (text) => <span>{text?.email}</span>,
		},
		{
			title: "Dịch vụ",
			dataIndex: "service",
			key: "service",
			render: (text) => <span>{text?.name}</span>,
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
			render: (text) => <span>{text}</span>,
		},
		{
			title: "Khoảng thời gian (giờ)",
			dataIndex: "duration",
			key: "duration",
			render: (text) => <span className="flex justify-center">{text} (giờ)</span>,
		},
		{
			title: "Ghi chú",
			dataIndex: "note",
			key: "note",
			render: (text) => <span>{text}</span>,
		},
	];

	return (
		<Table
			rowKey="_id"
			columns={columns}
			dataSource={appointments.filter(
				(appointment) =>
					appointment?.staff?._id === user?._id && appointment?.status === "Booked"
			)}
			loading={!appointments}
		/>
	);
};

export default Notification;