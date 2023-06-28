import { Button, Input, Table, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
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

const { Search } = Input;

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
	const [searchTerm, setSearchTerm] = useState("");

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
			title: "Dịch vụ",
			dataIndex: "service",
			key: "service",
			render: (text) => <span>{text?.name}</span>,
		},
		{
			title: "Vị trí",
			dataIndex: "location",
			key: "location",
			render: (text) => <span>{text?.fullName}</span>,
		},
		{
			title: "Nhân viên",
			dataIndex: "staff",
			key: "staff",
			render: (text) => <span>{`${text?.firstName} ${text?.lastName}`}</span>,
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Khoảng thời gian (giờ)",
			dataIndex: "duration",
			key: "duration",
			render: (text) => <span className="flex justify-center">{text} (giờ)</span>,
		},
		{
			title: "",
			dataIndex: "-",
			key: "-",
			width: "200px",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Tooltip title="Xem chi tiết">
						<Button onClick={() => handleViewDetails(record?._id)}>
							<IoEyeSharp />
						</Button>
					</Tooltip>

					<Tooltip title="Cập nhật">
						<Button onClick={() => handleUpdate(record?._id)}>
							<BsPencilFill />
						</Button>
					</Tooltip>

					<Tooltip title="Xóa">
						<Button
							onClick={() => handleDelete(record?._id)}
							disabled={moment().isBefore(
								moment(record.startDate.split("- ")[1]).add(3, "days")
							)}
						>
							<BsTrashFill />
						</Button>
					</Tooltip>
				</div>
			),
		},
	];

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/appointment/${appointmentId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllAppointmentsReducerAsync(accessToken, refreshToken));
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

	const onSearch = (value) => {
		setSearchTerm(value);
	};

	return (
		<>
			<Search
				placeholder="Nhập từ khóa cần tìm"
				allowClear
				onSearch={onSearch}
				enterButton
			/>

			<br />
			<br />

			<Table
				columns={columns}
				dataSource={[...appointments]
					.filter((appointment) => appointment?.user?._id === user?._id)
					.filter((appointment) =>
						searchTerm
							? appointment?.service?.name.includes(searchTerm) ||
							  appointment?.status.includes(searchTerm)
							: appointment
					)
					.reverse()}
				loading={!appointments}
				rowKey={(record) => record._id}
			/>

			<Modals
				title="Xóa cuộc hẹn"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa cuộc hẹn này?
			</Modals>
		</>
	);
};

export default AppointmentView;
