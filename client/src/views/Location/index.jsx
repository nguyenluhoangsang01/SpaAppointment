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
			title: "Full name",
			dataIndex: "fullName",
			key: "fullName",
		},
		{
			title: "Short name",
			dataIndex: "shortName",
			key: "shortName",
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
				<Tooltip title="Create">
					<Button
						onClick={() => navigate("/locations/create")}
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
				dataSource={[...locations]
					.filter((location) =>
						searchTerm ? location?.fullName.includes(searchTerm) : location
					)
					.reverse()}
				loading={!locations}
			/>

			<Modals
				title="Delete location"
				open={open}
				confirmLoading={confirmLoading}
				onOk={onOk}
				onCancel={onCancel}
			>
				Do you want to delete this location?
			</Modals>
		</>
	);
};

export default Location;
