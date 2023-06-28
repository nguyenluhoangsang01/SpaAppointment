import { Button, Form, Input, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const ChangePassword = () => {
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Ref
	const formRef = useRef(null);
	// State
	const [isLoading, setIsLoading] = useState(false);
	// Router
	const navigate = useNavigate();
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				"/user/profile/change-password",
				{ ...values },
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				formRef.current.resetFields();

				toast.success(data.message);

				setIsLoading(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "currentPassword") {
					formRef.current.setFields([
						{ name: "currentPassword", errors: [data.message] },
						{ name: "newPassword", errors: null },
						{ name: "confirmPassword", errors: null },
					]);
				} else if (data.name === "newPassword") {
					formRef.current.setFields([
						{ name: "currentPassword", errors: null },
						{ name: "newPassword", errors: [data.message] },
						{ name: "confirmPassword", errors: null },
					]);
				} else if (data.name === "confirmPassword") {
					formRef.current.setFields([
						{ name: "currentPassword", errors: null },
						{ name: "newPassword", errors: null },
						{ name: "confirmPassword", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "currentPassword", errors: null },
						{ name: "newPassword", errors: null },
						{ name: "confirmPassword", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	return (
		<Form
			name="change-password"
			layout="vertical"
			onFinish={onFinish}
			ref={formRef}
			{...layout}
			initialValues={{
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			}}
			className="divide-y-4"
		>
			<div>
				<Form.Item
					label="Mật khẩu hiện tại"
					name="currentPassword"
					rules={[
						{
							required: true,
							message: "Mật khẩu hiện tại không được để trống",
						},
					]}
				>
					<Input.Password placeholder="Mật khẩu hiện tại" />
				</Form.Item>
			</div>

			<div className="pt-8">
				<Form.Item
					label="Mật khẩu mới"
					name="newPassword"
					rules={[
						{
							required: true,
							message: "Mật khẩu mới không được để trống",
						},
						{
							min: 8,
							message: "Mật khẩu mới quá ngắn (tối thiểu 8 ký tự)",
						},
						{
							pattern:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
							message:
								"Mật khẩu mới phải chứa ít nhất một chữ thường, một chữ in hoa, một số và một ký tự đặc biệt",
						},
					]}
				>
					<Input.Password placeholder="Mật khẩu mới" />
				</Form.Item>

				<Form.Item
					label="Xác nhận mật khẩu mới"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: "Xác nhận mật khẩu mới không được để trống",
						},
					]}
				>
					<Input.Password placeholder="Xác nhận mật khẩu mới" />
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
			</div>
		</Form>
	);
};

export default ChangePassword;