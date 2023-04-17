import { Button } from "antd";
import axios from "axios";
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

const AppointmentViewDetails = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	// Title
	const title = data?.title;

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/appointment/${id}`,
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
		navigate(`/appointments/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/appointment/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/appointments");
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
						<th>Service</th>
						<td>{data?.service?.name}</td>
					</tr>

					<tr>
						<th>Staff</th>
						<td>{`${data?.staff?.firstName} ${data?.staff?.lastName}`}</td>
					</tr>
					<tr>
						<th>Title</th>
						<td>{data?.title}</td>
					</tr>
					<tr>
						<th>Duration</th>
						<td>{data?.duration}</td>
					</tr>
					<tr>
						<th>Status</th>
						<td>{data?.status}</td>
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
						<th>Note</th>
						<td>{data?.note ? data?.note : <span>not set</span>}</td>
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

export default AppointmentViewDetails;