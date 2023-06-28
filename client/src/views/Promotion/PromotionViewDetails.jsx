import { Button, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import { axiosConfig } from "../../utils/helpers";

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
		if (user?.role !== "Quản trị viên") navigate("/");
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
						<th>Dịch vụ</th>
						<td>
							{data?.service ? data?.service?.name : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Tên</th>
						<td>{data?.name ? data?.name : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Mô tả</th>
						<td>
							{data?.description ? (
								data?.description
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Type</th>
						<td>{data?.type ? data?.type : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Ngày bắt đầu</th>
						<td>
							{data?.startDate ? data?.startDate : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Ngày kết thúc</th>
						<td>
							{data?.endDate ? data?.endDate : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Giá trị</th>
						<td>
							{data?.value ? `${data?.value} VND` : <span>Chưa cập nhật</span>}
						</td>
					</tr>
					<tr>
						<th>Số lượt sử dụng tối đa</th>
						<td>
							{data?.maxUses ? (
								`${data?.maxUses} lần`
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Trạng thái</th>
						<td>{data?.isActive ? "Đang hoạt động" : "Chưa hoạt động"}</td>
					</tr>
					<tr>
						<th>Số lượt đã sử dụng</th>
						<td>{data?.totalUses ? data?.totalUses : 0}</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Xóa khuyến mãi"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa khuyến mãi này?
			</Modals>
		</>
	);
};

export default PromotionViewDetails;
