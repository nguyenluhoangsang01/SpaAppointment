import { Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import { formatDateTime } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const ScheduleViewDetails = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	// Title
	const title = `${user?.firstName} ${user?.lastName}`;

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Staff" && user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/schedule/${id}`,
					axiosConfig(accessToken, refreshToken)
				);

				if (data.success) {
					setData(data.data);
				}
			} catch ({ response: { data } }) {
				alert(data.message);
			}
		})();
	}, [accessToken, id, refreshToken]);

	if (!data) return <Loading />;

	const handleUpdate = () => {
		navigate(`/schedule/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/schedule/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/schedule/view-schedule");
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
			<h1 className="font-bold uppercase mb-8 text-2xl">
				View details: {title}
			</h1>

			<div className="flex items-center gap-4 mb-6">
				<Button
					className="bg-[yellow]"
					onClick={handleUpdate}
					disabled={id === user._id}
				>
					Update
				</Button>
				<Button
					className="bg-[red] text-white"
					onClick={() => setOpen(true)}
					disabled={id === user._id}
				>
					Delete
				</Button>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>First name</th>
						<td>{data?.staff?.firstName}</td>
					</tr>
					<tr>
						<th>Last name</th>
						<td>{data?.staff?.lastName}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{data?.staff?.email}</td>
					</tr>
					<tr>
						<th>Phone</th>
						<td>{data?.staff?.phone}</td>
					</tr>
					<tr>
						<th>Start date</th>
						<td>{data?.startDate}</td>
					</tr>
					<tr>
						<th>End date</th>
						<td>{data?.endDate}</td>
					</tr>
					<tr>
						<th>Type</th>
						<td>{data?.type}</td>
					</tr>
					<tr>
						<th>Created at</th>
						<td>
							{data?.createdAt ? (
								moment(data?.createdAt).format(formatDateTime)
							) : (
								<span>not set</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Updated at</th>
						<td>
							{data?.updatedAt ? (
								moment(data?.updatedAt).format(formatDateTime)
							) : (
								<span>not set</span>
							)}
						</td>
					</tr>
				</tbody>
			</table>

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

export default ScheduleViewDetails;
