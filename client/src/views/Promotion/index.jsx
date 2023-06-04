import { Button, Input, Table } from "antd";
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
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

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
			title: "#",
			dataIndex: "_id",
			key: "_id",
		},
		{
			title: "Service",
			dataIndex: "service",
			key: "service",
			render: (text, record) => <span>{record.name}</span>,
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Start date",
			dataIndex: "startDate",
			key: "startDate",
		},
		{
			title: "End date",
			dataIndex: "endDate",
			key: "endDate",
		},
		{
			title: "Value",
			dataIndex: "value",
			key: "value",
		},
		{
			title: "Active",
			dataIndex: "isActive",
			key: "isActive",
			render: (text, record) => <span>{text ? "Active" : "Inactive"}</span>,
		},
		{
			title: "Actions",
			dataIndex: "-",
			key: "-",
			render: (text, record) => (
				<div className="flex items-center justify-between">
					<Button onClick={() => handleViewDetails(record?._id)}>
						<IoEyeSharp />
					</Button>
					<Button
						onClick={() => handleUpdate(record?._id)}
						disabled={user?.role !== "Admin"}
					>
						<BsPencilFill />
					</Button>
					<Button
						onClick={() => handleDelete(record?._id)}
						disabled={user?.role !== "Admin"}
					>
						<BsTrashFill />
					</Button>
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
				<Button
					onClick={() => navigate("/promotions/create")}
					className="bg-[green] text-white"
					disabled={user?.role !== "Admin"}
				>
					Create
				</Button>
			</div>

			<Search
				placeholder="Enter the name you want to search for"
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
						searchTerm ? promotion?.name.includes(searchTerm) : promotion
					)
					.reverse()}
				loading={!promotions}
			/>

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

export default Promotion;