import { Button, Table } from "antd";
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

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

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
			title: "#",
			dataIndex: "_id",
			key: "_id",
		},
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
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Code",
			dataIndex: "code",
			key: "code",
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

	return (
		<>
			<div className="flex justify-end mb-4">
				<Button
					onClick={() => navigate("/gift-cards/create")}
					className="bg-[green] text-white"
					disabled={user?.role !== "Admin"}
				>
					Create
				</Button>
			</div>

			<Table
				rowKey="_id"
				columns={columns}
				dataSource={[...giftCards].reverse()}
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
