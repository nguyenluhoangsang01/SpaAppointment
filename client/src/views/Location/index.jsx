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
	getAllLocationsReducerAsync,
	selectLocation,
} from "../../redux/slice/location";
import { axiosConfig } from "../../utils/helpers";

const { Search } = Input;

const Location = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { locations } = useSelector(selectLocation);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [selectedLocationId, setSelectedLocationId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllLocationsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const handleViewDetails = (id) => {
		navigate(`/locations/${id}/view-details`);
	};

	const handleUpdate = (id) => {
		navigate(`${id}/update`);
	};

	const handleDelete = (id) => {
		setOpen(true);
		setSelectedLocationId(id);
	};

	const columns = [
		{
			title: "Tên đầy đủ",
			dataIndex: "fullName",
			key: "fullName",
			sorter: (a, b) => a.fullName.length - b.fullName.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Tên viết tắt",
			dataIndex: "shortName",
			key: "shortName",
			sorter: (a, b) => a.shortName.length - b.shortName.length,
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
				`/location/${selectedLocationId}`,
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);
				setConfirmLoading(false);
				setOpen(false);

				dispatch(getAllLocationsReducerAsync(accessToken, refreshToken));
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
						onClick={() => navigate("/locations/create")}
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
				dataSource={[...locations]
					.filter((location) =>
						searchTerm ? location?.fullName.includes(searchTerm) : location
					)
					.reverse()}
				loading={!locations}
			/>

			<Modals
				title="Xóa vị trí"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Bạn có muốn xóa vị trí này?
			</Modals>
		</>
	);
};

export default Location;
