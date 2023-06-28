import { Button, Tooltip } from "antd";
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

const UserViewDetails = () => {
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
	const title = `${data?.firstName} ${data?.lastName}`;

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
				Xem chi tiết: {title}
			</h1>

			<div className="flex items-center gap-4 mb-6">
				<Tooltip title="Cập nhật">
					<Button
						className="bg-[yellow]"
						onClick={handleUpdate}
						disabled={id === user?._id}
					>
						Cập nhật
					</Button>
				</Tooltip>
				<Tooltip title="Xóa">
					<Button
						className="bg-[red] text-white"
						onClick={() => setOpen(true)}
						disabled={id === user?._id}
					>
						Xóa
					</Button>
				</Tooltip>
			</div>

			<table className="view-details">
				<tbody>
					<tr>
						<th>Họ</th>
						<td>{data?.firstName ? data?.firstName : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Tên</th>
						<td>{data?.lastName ? data?.lastName : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{data?.email ? data?.email : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Số điện thoại</th>
						<td>{data?.phone ? data?.phone : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Vai trò</th>
						<td>{data?.role ? data?.role : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Địa chỉ</th>
						<td>{data?.address ? data?.address : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Giới thiệu</th>
						<td>{data?.bio ? data?.bio : <span>Chưa cập nhật</span>}</td>
					</tr>
					<tr>
						<th>Đăng nhập vào lúc</th>
						<td>
							{data?.loggedInAt ? (
								moment(data?.loggedInAt).format(formatDateTime)
							) : (
								<span>Chưa cập nhật</span>
							)}
						</td>
					</tr>
					<tr>
						<th>Đã đăng nhập tại ip</th>
						<td>
							{data?.loggedInIP ? data?.loggedInIP : <span>Chưa cập nhật</span>}
						</td>
					</tr>
				</tbody>
			</table>

			<Modals
				title="Xóa người dùng"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa người dùng này?
			</Modals>
		</>
	);
};

export default UserViewDetails;
