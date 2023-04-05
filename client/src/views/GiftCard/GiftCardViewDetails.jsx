import { Button } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import { axiosConfig } from "../../utils/helpers";

const GiftCardViewDetails = () => {
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
	const title = data?.code;

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
					`/gift-card/${id}`,
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
		navigate(`/gift-cards/${id}/update`);
	};

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/gift-card/${id}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				navigate("/gift-cards");
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
						<th>Promotion</th>
						<td>
							{data?.promotion ? data?.promotion?.name : <span>not set</span>}
						</td>
					</tr>
					<tr>
						<th>Code</th>
						<td>{data?.code ? data?.code : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Expiration date</th>
						<td>
							{data?.expirationDate ? (
								data?.expirationDate
							) : (
								<span>not set</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Status</th>
						<td>{data?.status ? data?.status : <span>not set</span>}</td>
					</tr>
					<tr>
						<th>Value</th>
						<td>{data?.value ? data?.value : <span>not set</span>}</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Delete gift card"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this gift card?
			</Modals>
		</>
	);
};

export default GiftCardViewDetails;