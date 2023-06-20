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
		if (user?.role !== "Admin") navigate("/");
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
			title: "First name",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Last name",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Phone number",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "Actions",
			dataIndex: "-",
			key: "-",
			width: "200px",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Tooltip title="View details">
						<Button onClick={() => handleViewDetails(record?._id)}>
							<IoEyeSharp />
						</Button>
					</Tooltip>

					<Tooltip title="Update">
						<Button
							onClick={() => handleUpdate(record?._id)}
							disabled={user?._id === record?._id}
						>
							<BsPencilFill />
						</Button>
					</Tooltip>

					<Tooltip title="Delete">
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
				placeholder="Enter search term you want to search for"
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

export default User;