import { Button, Input, Table, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import { getAllUsersReducerAsync, selectUser } from "../../redux/slice/user";
import { axiosConfig } from "../../utils/helpers";

const { Search } = Input;

const User = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { users } = useSelector(selectUser);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [deleteUserId, setDeleteUserId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Quản trị viên") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/users/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setDeleteUserId(id);
	};

	const columns = [
		{
			title: "Họ",
			dataIndex: "firstName",
			key: "firstName",
			sorter: (a, b) => a.firstName.length - b.firstName.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Tên",
			dataIndex: "lastName",
			key: "lastName",
			sorter: (a, b) => a.lastName.length - b.lastName.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			sorter: (a, b) => a.email.length - b.email.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Số điện thoại",
			dataIndex: "phone",
			key: "phone",
			sorter: (a, b) => a.phone.toString().localeCompare(b.phone),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Vai trò",
			dataIndex: "role",
			key: "role",
			sorter: (a, b) => a.role.length - b.role.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Địa chỉ",
			dataIndex: "address",
			key: "address",
			sorter: (a, b) => a.address.length - b.address.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "",
			dataIndex: "-",
			key: "-",
			width: "200px",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Tooltip title="Xem chi tiết">
						<Button onClick={() => handleViewDetails(record?._id)}>
							<IoEyeSharp />
						</Button>
					</Tooltip>

					<Tooltip title="Cập nhật">
						<Button
							onClick={() => handleUpdate(record?._id)}
							disabled={user?._id === record?._id}
						>
							<BsPencilFill />
						</Button>
					</Tooltip>

					<Tooltip title="Xóa">
						<Button
							disabled={user?._id === record?._id}
							onClick={() => handleDelete(record?._id)}
						>
							<BsTrashFill />
						</Button>
					</Tooltip>
				</div>
			),
		},
	];

	const onOk = async () => {
		setConfirmLoading(true);

		try {
			const { data } = await axios.delete(
				`/user/${deleteUserId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
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

	const onSearch = (value) => {
		setSearchTerm(value);
	};

	return (
		<>
			<Search
				placeholder="Nhập từ khóa cần tìm"
				allowClear
				onSearch={onSearch}
				enterButton
			/>

			<br />
			<br />

			<Table
				rowKey="_id"
				columns={columns}
				dataSource={[...users]
					.filter((user) =>
						searchTerm
							? user?.firstName.includes(searchTerm) ||
							  user?.lastName.includes(searchTerm) ||
							  user?.email.includes(searchTerm) ||
							  user?.phone.includes(searchTerm) ||
							  user?.role.includes(searchTerm) ||
							  user?.address.includes(searchTerm)
							: user
					)
					.reverse()}
				loading={!users}
			/>

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

export default User;
