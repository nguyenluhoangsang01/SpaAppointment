import Cookies from "js-cookie";
import { Button, Form, Input, Select, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { selectAuth } from "../../redux/slice/auth";
import { SELECT_ROLES, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const UserUpdate = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	// Title
	const title = `${data?.firstName} ${data?.lastName}`;
	// Ref
	const formRef = useRef(null);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Quản trị viên") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/user/details/${id}`,
					axiosConfig(accessToken, refreshToken)
				);

				if (data.success) {
					setData(data.data);
				}
			} catch ({ response: { data } }) {
				console.log(data.message);
			}
		})();
	}, [accessToken, id, refreshToken]);

	if (!data) return <Loading />;

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				`/user/details/${id}`,
				{ ...values },
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);

				navigate(`/users/${id}/view-details`);

				setIsLoading(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "firstName") {
					formRef.current.setFields([
						{ name: "firstName", errors: [data.message] },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "role", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "lastName") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: [data.message] },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "role", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "email") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: [data.message] },
						{ name: "phone", errors: null },
						{ name: "role", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "phone") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: [data.message] },
						{ name: "role", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "role") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "role", errors: [data.message] },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "address") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "role", errors: null },
						{ name: "address", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "role", errors: null },
						{ name: "address", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	return (
		<>
			<h1 className="font-bold uppercase mb-8 text-2xl">Cập nhật: {title}</h1>

			<Form
				name="sign-up"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{ ...data }}
			>
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
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: "Email không được để trống",
						},
						{
							type: "email",
							message: "Email không phải là một email hợp lệ",
						},
					]}
				>
					<Input placeholder="Email" />
				</Form.Item>

				<Form.Item
					label="Số điện thoại"
					name="phone"
					rules={[
						{
							required: true,
							message: "Số điện thoại không được để trống",
						},
						{
							pattern:
								/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/,
							message: "Điện thoại phải là số điện thoại hợp lệ",
						},
					]}
				>
					<Input placeholder="Số điện thoại" />
				</Form.Item>

				{user?.role === "Quản trị viên" && (
					<Form.Item
						label="Roles"
						name="role"
						rules={[
							{
								required: true,
								message: "Roles can't be blank",
							},
						]}
					>
						<Select options={SELECT_ROLES} />
					</Form.Item>
				)}

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
		</>
	);
};

export default UserUpdate;
