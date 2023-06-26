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
	getAllGiftCardsReducerAsync,
	selectGiftCard,
} from "../../redux/slice/giftCard";
import { axiosConfig } from "../../utils/helpers";

const { Search } = Input;

const GiftCard = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { giftCards } = useSelector(selectGiftCard);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [giftCardId, setGiftCardId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllGiftCardsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/gift-cards/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setGiftCardId(id);
	};

	const columns = [
		{
			title: "Promotion",
			dataIndex: "promotion",
			key: "promotion",
			render: (text, record) => <span>{record.promotion.name}</span>,
		},
		{
			title: "Value",
			dataIndex: "value",
			key: "value",
			render: (text) => <span>{text} VND</span>,
		},
		{
			title: "Code",
			dataIndex: "code",
			key: "code",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Expiration date",
			dataIndex: "expirationDate",
			key: "expirationDate",
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
							disabled={user?.role !== "Admin"}
						>
							<BsPencilFill />
						</Button>
					</Tooltip>

					<Tooltip title="Delete">
						<Button
							onClick={() => handleDelete(record?._id)}
							disabled={user?.role !== "Admin"}
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
				`/gift-card/${giftCardId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				dispatch(getAllGiftCardsReducerAsync(accessToken, refreshToken));
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
				<Tooltip title="Create">
					<Button
						onClick={() => navigate("/gift-cards/create")}
						className="bg-[green] text-white"
						disabled={user?.role !== "Admin"}
					>
						Create
					</Button>
				</Tooltip>
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
				dataSource={[...giftCards]
					.filter((giftCard) =>
						searchTerm
							? giftCard?.promotion?.name.includes(searchTerm)
							: giftCard
					)
					.reverse()}
				loading={!giftCards}
			/>

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

export default GiftCard;
