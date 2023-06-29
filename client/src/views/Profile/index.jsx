import { Button, Form, Image, Input, Table, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import RenderFile from "../../components/RenderFile";
import {
	getAllAppointmentsReducerAsync,
	selectAppointment,
} from "../../redux/slice/appointment";
import { selectAuth, updateProfile } from "../../redux/slice/auth";
import { formatDateTime, layout } from "../../utils/constants";
import { axiosConfigFormData } from "../../utils/helpers";

const Profile = () => {
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { appointments } = useSelector(selectAppointment);
	// Ref
	const formRef = useRef(null);
	const avatarRef = useRef(null);
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [avatar, setAvatar] = useState(null);
	// Router
	const navigate = useNavigate();
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllAppointmentsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				"/user/profile",
				{ ...values, avatar },
				axiosConfigFormData(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(updateProfile(data));

				toast.success(data.message);

				setIsLoading(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "firstName") {
					formRef.current.setFields([
						{ name: "firstName", errors: [data.message] },
						{ name: "lastName", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "lastName") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: [data.message] },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "address") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "address", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "address", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	const appointmentColumns = [
		{
			title: "Dịch vụ",
			dataIndex: "service",
			key: "service",
			render: (text, record) => <span>{text?.name}</span>,
			sorter: (a, b) => a.service.length - b.service.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Nhân viên",
			dataIndex: "staff",
			key: "staff",
			render: (text, record) => (
				<span>{`${text?.firstName} ${text?.lastName}`}</span>
			),
			sorter: (a, b) => a.staff.length - b.staff.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
			sorter: (a, b) => a.startDate.length - b.startDate.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
			sorter: (a, b) => a.endDate.length - b.endDate.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			sorter: (a, b) => a.status.length - b.status.length,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Khoảng thời gian (giờ)",
			dataIndex: "duration",
			key: "duration",
			render: (text) => (
				<span className="flex justify-center">{text} (giờ)</span>
			),
			sorter: (a, b) => a.duration.toString().localeCompare(b.duration),
			sortDirections: ["descend", "ascend"],
		},
	];

	const handleAvatarClick = () => {
		avatarRef?.current?.click();
	};

	return (
		<div className="divide-y-4">
			<Form
				name="profile"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{
					...user,
					createdAt: moment(user?.createdAt).format(formatDateTime),
					updatedAt: moment(user?.updatedAt).format(formatDateTime),
				}}
			>
				<Form.Item label="Hình ảnh đại diện">
					<Image
						src={user?.avatar}
						alt={`${user?.firstName} ${user?.lastName}`}
						preview={false}
						width={250}
						height={250}
						className="rounded-full cursor-pointer"
						onClick={handleAvatarClick}
					/>
					<br />
					<br />
					<Dropzone setAvatar={setAvatar} ref={avatarRef} />
				</Form.Item>
				{avatar && (
					<Form.Item name="avatar">
						<RenderFile
							avatar={{
								format: avatar.type.split("/")[1],
								name: avatar.name,
								size: avatar.size,
							}}
						/>
					</Form.Item>
				)}

				<Form.Item
					label="Họ"
					name="firstName"
					rules={[
						{
							required: true,
							message: "Họ không được để trống",
						},
					]}
				>
					<Input placeholder="Họ" />
				</Form.Item>

				<Form.Item
					label="Tên"
					name="lastName"
					rules={[
						{
							required: true,
							message: "Tên không được để trống",
						},
					]}
				>
					<Input placeholder="Tên" />
				</Form.Item>

				<Form.Item
					label="Địa chỉ"
					name="address"
					rules={[
						{
							required: true,
							message: "Địa chỉ không được để trống",
						},
					]}
				>
					<Input placeholder="Địa chỉ" />
				</Form.Item>

				<Form.Item label="Giới thiệu" name="bio">
					<TextArea
						rows={8}
						placeholder={user?.bio ? user?.bio : "Chưa cập nhật"}
					/>
				</Form.Item>

				<Form.Item label="Vai trò" name="role">
					<Input disabled />
				</Form.Item>

				<Form.Item label="Đăng nhập vào lúc" name="loggedInAt">
					<Input disabled />
				</Form.Item>

				<Form.Item label="Đã đăng nhập tại ip" name="loggedInIP">
					<Input disabled />
				</Form.Item>

				<Form.Item label="Tạo vào lúc" name="createdAt">
					<Input disabled />
				</Form.Item>

				<Form.Item label="Cập nhật vào lúc" name="updatedAt">
					<Input disabled />
				</Form.Item>

				<Form.Item>
					<Tooltip title="Cập nhật">
						<Button
							type="primary"
							htmlType="submit"
							className="bg-black flex items-center gap-2"
							disabled={isLoading}
						>
							{isLoading && (
								<AiOutlineLoading3Quarters className="animate-spin" />
							)}
							<span>Cập nhật</span>
						</Button>
					</Tooltip>
				</Form.Item>
			</Form>

			<div>
				<h2 className="mt-8 font-bold uppercase text-[20px]">
					Các cuộc hẹn đã đặt
				</h2>

				<Table
					className="pt-10"
					rowKey="_id"
					columns={appointmentColumns}
					dataSource={[...appointments]
						.filter((appointment) => appointment?.user?._id === user?._id)
						.reverse()}
					loading={!appointments}
				/>
			</div>
		</div>
	);
};

export default Profile;
