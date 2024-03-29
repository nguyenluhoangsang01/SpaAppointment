import { Button, Form, Image, Input, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import Modals from "../../components/Modals";
import RenderFile from "../../components/RenderFile";
import { selectAuth } from "../../redux/slice/auth";
import { ROLES, layout } from "../../utils/constants";

const SignUp = () => {
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [isLoading2, setIsLoading2] = useState(false);
	const [avatar, setAvatar] = useState(null);
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	// Router
	const navigate = useNavigate();
	// Redux
	const { user } = useSelector(selectAuth);
	// Ref
	const formRef = useRef(null);

	useEffect(() => {
		if (user) navigate("/");
	}, [navigate, user]);

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post("/auth/verify-email", { ...values });

			if (data.success) {
				setEmail(values.email);

				toast.success(data.message);

				setIsLoading(false);

				setOpen(true);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "email") {
					formRef.current.setFields([
						{ name: "email", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([{ name: "email", errors: null }]);
				}

				setIsLoading(false);
			}
		}
	};

	const onFinish2 = async (values) => {
		setIsLoading2(true);

		try {
			const { data } = await axios.post(
				"/auth/register",
				{ ...values, avatar, email },
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			if (data.success) {
				toast.success(data.message);

				setIsLoading2(false);

				setOpen(false);

				navigate("/sign-in");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "firstName") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: [data.message] },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "activeCode") {
					formRef.current.setFields([
						{ name: "activeCode", errors: [data.message] },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "lastName") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: [data.message] },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "phone") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: [data.message] },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "password") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: [data.message] },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "confirmPassword") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: [data.message] },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "address") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: [data.message] },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "role") {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "activeCode", errors: null },
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				}
				setIsLoading2(false);
			}
		}
	};

	const onCancel = () => {
		setOpen(false);
	};

	return (
		<div className="relative">
			<div className="mb-8">
				<Image
					src="https://www.picktime.com/webassets/2021/img/picktime-hero-new.svg"
					alt="Spa Appointment App"
					preview={false}
				/>
			</div>

			<Form
				name="verify-email"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{ email: "" }}
			>
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

				<Form.Item>
					<p>
						Đã có tài khoản?{" "}
						<Link to="/sign-in" className="cursor-pointer text-green-700">
							<u>Đăng nhập</u>
						</Link>
					</p>
				</Form.Item>

				<Form.Item>
					<Tooltip title="Xác thực email">
						<Button
							type="primary"
							htmlType="submit"
							className="bg-black flex items-center gap-2"
							disabled={isLoading}
						>
							{isLoading && (
								<AiOutlineLoading3Quarters className="animate-spin" />
							)}
							<span>Xác thực email</span>
						</Button>
					</Tooltip>
				</Form.Item>
			</Form>

			<Modals
				title="Đăng ký"
				open={open}
				confirmLoading={isLoading2}
				onCancel={onCancel}
				footer={null}
			>
				<Form
					name="sign-up"
					layout="vertical"
					onFinish={onFinish2}
					ref={formRef}
					{...layout}
					initialValues={{
						activeCode: "",
						address: "",
						avatar: null,
						confirmPassword: "",
						firstName: "",
						lastName: "",
						password: "",
						phone: "",
						role: ROLES.Customer,
					}}
				>
					<Form.Item
						label="Mã xác thực"
						name="activeCode"
						rules={[
							{
								required: true,
								message: "Mã xác thực không được để trống",
							},
						]}
					>
						<Input placeholder="Mã xác thực" showCount maxLength={6} />
					</Form.Item>

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

					<Form.Item
						label="Mật khẩu"
						name="password"
						rules={[
							{
								required: true,
								message: "Mật khẩu không được để trống",
							},
							{
								min: 8,
								message: "Mật khẩu quá ngắn (tối thiểu 8 ký tự)",
							},
							{
								pattern:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
								message:
									"Mật khẩu phải chứa ít nhất một chữ thường, một chữ in hoa, một số và một ký tự đặc biệt",
							},
						]}
					>
						<Input.Password placeholder="Mật khẩu" />
					</Form.Item>

					<Form.Item
						label="Xác nhận mật khẩu"
						name="confirmPassword"
						rules={[
							{
								required: true,
								message: "Xác nhận mật khẩu không được để trống",
							},
						]}
					>
						<Input.Password placeholder="Xác nhận mật khẩu" />
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

					<Form.Item label="Hình ảnh đại diện">
						<Dropzone setAvatar={setAvatar} />
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

					<Form.Item>
						<Tooltip title="Đăng ký">
							<Button
								type="primary"
								htmlType="submit"
								className="bg-black flex items-center gap-2"
								disabled={isLoading2}
							>
								{isLoading && (
									<AiOutlineLoading3Quarters className="animate-spin" />
								)}
								<span>Đăng ký</span>
							</Button>
						</Tooltip>
					</Form.Item>
				</Form>
			</Modals>
		</div>
	);
};

export default SignUp;
