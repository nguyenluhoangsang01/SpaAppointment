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

const UserViewDetails = () => {
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
	const title = `${data?.firstName} ${data?.lastName}`;

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/user/details/${id}`,
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
		navigate(`/users/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/user/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/users");
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
						<td>{data?.firstName ? data?.firstName : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Last name</th>
						<td>{data?.lastName ? data?.lastName : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{data?.email ? data?.email : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Phone</th>
						<td>{data?.phone ? data?.phone : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Role</th>
						<td>{data?.role ? data?.role : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Address</th>
						<td>{data?.address ? data?.address : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Bio</th>
						<td>{data?.bio ? data?.bio : <span>not set</span>}</td>
					</tr>

					<tr>
						<th>Logged in at</th>
						<td>
							{data?.loggedInAt ? (
								moment(data?.loggedInAt).format(formatDateTime)
							) : (
								<span>not set</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Logged in ip</th>
						<td>
							{data?.loggedInIP ? data?.loggedInIP : <span>not set</span>}
						</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Delete user"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this user?
			</Modals>
		</>
	);
};

export default UserViewDetails;