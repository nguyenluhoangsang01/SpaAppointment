import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";
import Loading from "../../components/Loading";
import Modals from "../../components/Modals";
import { toast } from "react-hot-toast";
import { Button } from "antd";

const PromotionViewDetails = () => {
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
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/promotion/${id}`,
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
		navigate(`/promotions/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/promotion/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/promotions");
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

			{console.log(data)}

			<table className="view-details">
				<tbody>
					<tr>
						<th>Service</th>
						<td>
							{data?.service ? data?.service?.name : <span>not set</span>}
						</td>
					</tr>
					<tr>
						<th>Name</th>
						<td>{data?.name ? data?.name : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Description</th>
						<td>
							{data?.description ? data?.description : <span>not set</span>}
						</td>
					</tr>
					<tr>
						<th>Type</th>
						<td>{data?.type ? data?.type : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Start date</th>
						<td>{data?.startDate ? data?.startDate : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>End date</th>
						<td>{data?.endDate ? data?.endDate : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Value</th>
						<td>{data?.value ? data?.value : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Max uses</th>
						<td>{data?.maxUses ? data?.maxUses : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Active</th>
						<td>{data?.isActive ? "Active" : "Inactive"}</td>
					</tr>
					<tr>
						<th>Total uses</th>
						<td>{data?.totalUses ? data?.totalUses : 0}</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Delete promotion"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this promotion?
			</Modals>
		</>
	);
};

export default PromotionViewDetails;
