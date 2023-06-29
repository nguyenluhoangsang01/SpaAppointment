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
import {
	getAllServicesReducerAsync,
	selectService,
} from "../../redux/slice/service";
import { axiosConfig } from "../../utils/helpers";

const { Search } = Input;

const Service = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [deleteServiceId, setDeleteServiceId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllServicesReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/services/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setDeleteServiceId(id);
	};

	const columns = [
		{
			title: "Tên",
			dataIndex: "name",
			key: "name",
			sorter: (a, b) => a.name.length - b.name.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Giá",
			dataIndex: "price",
			key: "price",
			render: (text) => <span>{text} VND</span>,
			sorter: (a, b) => a.price.toString().localeCompare(b.price),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Khoảng thời gian (giờ)",
			dataIndex: "duration",
			key: "duration",
			render: (text) => <span>{text} (giờ)</span>,
			sorter: (a, b) => a.duration.toString().localeCompare(b.duration),
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
							disabled={user?.role !== "Quản trị viên"}
						>
							<BsPencilFill />
						</Button>
					</Tooltip>

					<Tooltip title="Xóa">
						<Button
							onClick={() => handleDelete(record?._id)}
							disabled={user?.role !== "Quản trị viên"}
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
				`/service/${deleteServiceId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				dispatch(getAllServicesReducerAsync(accessToken, refreshToken));
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
			<div className="flex justify-end mb-4">
				<Tooltip title="Tạo">
					<Button
						onClick={() => navigate("/services/create")}
						className="bg-[green] text-white"
						disabled={user?.role !== "Quản trị viên"}
					>
						Tạo
					</Button>
				</Tooltip>
			</div>

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
				dataSource={[...services]
					.filter((service) =>
						searchTerm ? service?.name.includes(searchTerm) : service
					)
					.reverse()}
				loading={!services}
			/>

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

export default Service;
