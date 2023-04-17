import { Button, Image } from "antd";
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

const ServiceViewDetails = () => {
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
	const title = data?.name;

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
					`/service/${id}`,
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
		navigate(`/services/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/service/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/services");
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
				<Button className="bg-[yellow]" onClick={handleUpdate}>
					Update
				</Button>
				<Button className="bg-[red] text-white" onClick={() => setOpen(true)}>
					Delete
				</Button>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>Name</th>
						<td>{data?.name ? data?.name : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Price</th>
						<td>{data?.price ? data?.price : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Duration</th>
						<td>{data?.duration ? data?.duration : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Description</th>
						<td>
							{data?.description ? data?.description : <span>not set</span>}
						</td>
					</tr>
					<tr>
						<th>Image</th>
						<td>
							<Image
								src={data?.image}
								alt={data?.name}
								width={1280}
								height={800}
							/>
						</td>
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
				title="Delete service"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this service?
			</Modals>
		</>
	);
};

export default ServiceViewDetails;