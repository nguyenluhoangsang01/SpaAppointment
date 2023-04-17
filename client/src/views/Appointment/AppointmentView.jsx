import { Button, Table } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import {
	getAllAppointmentsReducerAsync,
	selectAppointment,
} from "../../redux/slice/appointment";
import { selectAuth } from "../../redux/slice/auth";
import { axiosConfig } from "../../utils/helpers";

const AppointmentView = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { appointments } = useSelector(selectAppointment);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [appointmentId, setAppointmentId] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllAppointmentsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/appointments/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setAppointmentId(id);
	};

	const columns = [
		{
			title: "#",
			dataIndex: "_id",
			key: "_id",
		},
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Service",
			dataIndex: "service",
			key: "service",
			render: (text, record) => <span>{text?.name}</span>,
		},
		{
			title: "Staff",
			dataIndex: "staff",
			key: "staff",
			render: (text, record) => (
				<span>{`${text?.firstName} ${text?.lastName}`}</span>
			),
		},
		{
			title: "Start date",
			dataIndex: "startDate",
			key: "startDate",
		},
		{
			title: "End date",
			dataIndex: "endDate",
			key: "endDate",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Duration (h)",
			dataIndex: "duration",
			key: "duration",
		},
		{
			title: "Actions",
			dataIndex: "-",
			key: "-",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Button onClick={() => handleViewDetails(record?._id)}>
						<IoEyeSharp />
					</Button>
					<Button onClick={() => handleUpdate(record?._id)}>
						<BsPencilFill />
					</Button>
					<Button onClick={() => handleDelete(record?._id)}>
						<BsTrashFill />
					</Button>
				</div>
			),
		},
	];

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/service/${appointmentId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setConfirmLoading(false);
				setOpen(false);
			}
		}
	};

	const onCancel = () => {
		setOpen(false);
	};

	return (
		<>
			<Table
				rowKey="_id"
				columns={columns}
				dataSource={[...appointments]
					.filter((appointment) => appointment?.user?._id === user?._id)
					.reverse()}
				loading={!appointments}
			/>

			<Modals
				title="Delete appointment"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this appointment?
			</Modals>
		</>
	);
};

export default AppointmentView;