import { Button, Image, Tooltip } from "antd";
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
				Xem chi tiết: {title}
			</h1>

			<div className="flex items-center gap-4 mb-6">
				<Tooltip title="Cập nhật">
					<Button className="bg-[yellow]" onClick={handleUpdate}>
						Cập nhật
					</Button>
				</Tooltip>
				<Tooltip title="Xóa">
					<Button className="bg-[red] text-white" onClick={() => setOpen(true)}>
						Xóa
					</Button>
				</Tooltip>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>Tên</th>
						<td>{data?.name ? data?.name : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Giá</th>
						<td>{data?.price ? `${data?.price} VND` : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Khoảng thời gian (giờ)</th>
						<td>{data?.duration ? `${data?.duration} (giờ)` : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Mô tả</th>
						<td>
							{data?.description ? data?.description : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Hình ảnh</th>
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
				title="Xóa dịch vụ"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa dịch vụ này không?
			</Modals>
		</>
	);
};

export default ServiceViewDetails;
