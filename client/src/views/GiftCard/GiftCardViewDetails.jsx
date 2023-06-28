import { Button, Tooltip } from "antd";
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
		if (user?.role !== "Quản trị viên") navigate("/");
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
				Xem chi tiết: {title}
			</h1>

			<div className="flex items-center gap-4 mb-6">
				<Tooltip title="Cập nhật">
					<Button className="bg-[yellow]" onClick={handleUpdate}>
						Cập nhật
					</Button>
				</Tooltip>
				<Tooltip title="Delte">
					<Button className="bg-[red] text-white" onClick={() => setOpen(true)}>
						Xóa
					</Button>
				</Tooltip>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>Tên khuyến mãi</th>
						<td>
							{data?.promotion ? (
								data?.promotion?.name
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Mã thẻ quà tặng</th>
						<td>{data?.code ? data?.code : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Ngày hết hạn</th>
						<td>
							{data?.expirationDate ? (
								data?.expirationDate
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Trạng thái</th>
						<td>{data?.status ? data?.status : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Giá trị</th>
						<td>
							{data?.value ? `${data?.value} VND` : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Tạo vào lúc</th>
						<td>
							{data?.createdAt ? (
								moment(data?.createdAt).format(formatDateTime)
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Cập nhật vào lúc</th>
						<td>
							{data?.updatedAt ? (
								moment(data?.updatedAt).format(formatDateTime)
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Xóa thẻ quà tặng"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa thẻ quà tặng này không?
			</Modals>
		</>
	);
};

export default GiftCardViewDetails;