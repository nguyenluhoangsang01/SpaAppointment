import { Button, Form, Input } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { layout } from "../../utils/constants";
import { axiosConfig, validateErrors } from "../../utils/helpers";

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
				setIsLoading(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				validateErrors(data, formRef);

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
					label="Current password"
					name="currentPassword"
					rules={[
						{
							required: true,
							message: "Current password can't be blank",
						},
					]}
				>
					<Input.Password placeholder="Current password" />
				</Form.Item>
			</div>

			<div className="pt-8">
				<Form.Item
					label="New password"
					name="newPassword"
					rules={[
						{
							required: true,
							message: "New password can't be blank",
						},
						{
							min: 8,
							message: "New password is too short (minimum is 8 characters)",
						},
						{
							pattern:
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
							message:
								"New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
						},
					]}
				>
					<Input.Password placeholder="New password" />
				</Form.Item>

				<Form.Item
					label="Confirm new password"
					name="confirmPassword"
					rules={[
						{
							required: true,
							message: "Confirm new password can't be blank",
						},
					]}
				>
					<Input.Password placeholder="Confirm new password" />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="bg-black flex items-center gap-2"
						disabled={isLoading}
					>
						{isLoading && (
							<AiOutlineLoading3Quarters className="animate-spin" />
						)}
						<span>Update</span>
					</Button>
				</Form.Item>
			</div>
		</Form>
	);
};

export default ChangePassword;