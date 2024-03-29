import { Button, Table, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import {
	getAllScheduleReducerAsync,
	selectSchedule,
} from "../../redux/slice/schedule";
import { axiosConfig } from "../../utils/helpers";

const ScheduleView = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { schedule } = useSelector(selectSchedule);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [scheduleId, setScheduleId] = useState(null);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Nhân viên" && user?.role !== "Quản trị viên")
			navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		dispatch(getAllScheduleReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/schedule/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setScheduleId(id);
	};

	const columns = [
		{
			title: "Họ",
			dataIndex: "firstName",
			key: "firstName",
			render: (text, record) => <span>{record?.staff?.firstName}</span>,
			sorter: (a, b) => a.firstName.length - b.firstName.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Tên",
			dataIndex: "lastName",
			key: "lastName",
			render: (text, record) => <span>{record?.staff?.lastName}</span>,
			sorter: (a, b) => a.lastName.length - b.lastName.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (text, record) => <span>{record?.staff?.email}</span>,
			sorter: (a, b) => a.staff.length - b.staff.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Số điện thoại",
			dataIndex: "phone",
			key: "phone",
			render: (text, record) => <span>{record?.staff?.phone}</span>,
			sorter: (a, b) => a.phone.toString().localeCompare(b.phone),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
			sorter: (a, b) => a.startDate.length - b.startDate.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
			sorter: (a, b) => a.endDate.length - b.endDate.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Loại làm việc",
			dataIndex: "type",
			key: "type",
			sorter: (a, b) => a.type.length - b.type.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "",
			dataIndex: "-",
			key: "-",
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
						<Button onClick={() => handleDelete(record?._id)}>
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
				`/schedule/${scheduleId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllScheduleReducerAsync(accessToken, refreshToken));
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
				columns={columns}
				dataSource={[...schedule]
					.filter((item) =>
						user?.role !== "Quản trị viên"
							? item?.staff?._id === user?._id
							: item
					)
					.reverse()}
				loading={!schedule}
				rowKey={(record) => record._id}
			/>

			<Modals
				title="Xóa lịch trình"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa lịch trình này?
			</Modals>
		</>
	);
};

export default ScheduleView;
