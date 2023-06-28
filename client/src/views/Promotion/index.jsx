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
	getAllPromotionsReducerAsync,
	selectPromotion,
} from "../../redux/slice/promotion";
import { axiosConfig } from "../../utils/helpers";

const { Search } = Input;

const Promotion = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { promotions } = useSelector(selectPromotion);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [promotionId, setPromotionId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllPromotionsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/promotions/${id}/view-details`);
	};
	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};
	const handleDelete = (id) => {
		setPromotionId(id);
		setOpen(true);
	};

	const onSearch = (value) => {
		setSearchTerm(value);
	};

	const columns = [
		{
			title: "Dịch vụ",
			dataIndex: "service",
			key: "service",
			render: (text, record) => <span>{record.name}</span>,
		},
		{
			title: "Tên",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Loại khuyến mãi",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
		},
		{
			title: "Giá trị",
			dataIndex: "value",
			key: "value",
			render: (text) => <span>{text} VND</span>,
		},
		{
			title: "Trạng thái",
			dataIndex: "isActive",
			key: "isActive",
			render: (text) => (
				<span>{text ? "Đang hoạt động" : "Chưa hoạt động"}</span>
			),
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
				`/promotion/${promotionId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				dispatch(getAllPromotionsReducerAsync(accessToken, refreshToken));
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
			<div className="flex justify-end mb-4">
				<Tooltip title="Tạo">
					<Button
						onClick={() => navigate("/promotions/create")}
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
				dataSource={[...promotions]
					.filter((promotion) =>
						searchTerm
							? promotion?.service?.name.includes(searchTerm) ||
							  promotion?.name.includes(searchTerm) ||
							  promotion?.type.includes(searchTerm) ||
							  promotion?.startDate.includes(searchTerm) ||
							  promotion?.endDate.includes(searchTerm) ||
							  promotion?.value.toString().includes(searchTerm) ||
							  promotion?.active.includes(searchTerm)
							: promotion
					)
					.reverse()}
				loading={!promotions}
			/>

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

export default Promotion;
