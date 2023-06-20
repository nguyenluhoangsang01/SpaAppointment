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
		if (user?.role !== "Staff" && user?.role !== "Admin") navigate("/");
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
			title: "First name",
			dataIndex: "firstName",
			key: "firstName",
			render: (text, record) => <span>{record?.staff?.firstName}</span>,
		},
		{
			title: "Last name",
			dataIndex: "lastName",
			key: "lastName",
			render: (text, record) => <span>{record?.staff?.lastName}</span>,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (text, record) => <span>{record?.staff?.email}</span>,
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			render: (text, record) => <span>{record?.staff?.phone}</span>,
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
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Actions",
			dataIndex: "-",
			key: "-",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Tooltip title="View details">
						<Button onClick={() => handleViewDetails(record?._id)}>
							<IoEyeSharp />
						</Button>
					</Tooltip>
					<Tooltip title="Update">
						<Button onClick={() => handleUpdate(record?._id)}>
							<BsPencilFill />
						</Button>
					</Tooltip>
					<Tooltip title="Delete">
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

	console.log();

	return (
		<>
			<Table
				columns={columns}
				dataSource={[...schedule]
					.filter((item) =>
						user?.role !== "Admin" ? item?.staff?._id === user?._id : item
					)
					.reverse()}
				loading={!schedule}
				rowKey={(record) => record._id}
			/>

			<Modals
				title="Delete schedule"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this schedule?
			</Modals>
		</>
	);
};

export default ScheduleView;
