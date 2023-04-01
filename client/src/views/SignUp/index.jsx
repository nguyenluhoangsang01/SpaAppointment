import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import RenderFile from "../../components/RenderFile";
import { selectAuth } from "../../redux/slice/auth";
import { layout, ROLES } from "../../utils/constants";

const SignUp = () => {
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [avatar, setAvatar] = useState(null);
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
			const { data } = await axios.post(
				"/auth/register",
				{ ...values, avatar },
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			if (data.success) {
				toast.success(data.message);

				setIsLoading(false);

				navigate("/sign-in");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "firstName") {
					formRef.current.setFields([
						{ name: "firstName", errors: [data.message] },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "lastName") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: [data.message] },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "email") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: [data.message] },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "phone") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: [data.message] },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "password") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: [data.message] },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "confirmPassword") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: [data.message] },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "address") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: [data.message] },
						{ name: "role", errors: null },
					]);
				} else if (data.name === "role") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "email", errors: null },
						{ name: "phone", errors: null },
						{ name: "password", errors: null },
						{ name: "confirmPassword", errors: null },
						{ name: "address", errors: null },
						{ name: "role", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	return (
		<Form
			name="sign-up"
			layout="vertical"
			onFinish={onFinish}
			ref={formRef}
			{...layout}
			initialValues={{
				address: "",
				avatar: null,
				confirmPassword: "",
				email: "",
				firstName: "",
				lastName: "",
				password: "",
				phone: "",
				role: ROLES.Customer,
			}}
		>
			<Form.Item
				label="First name"
				name="firstName"
				rules={[
					{
						required: true,
						message: "First name can't be blank",
					},
				]}
			>
				<Input placeholder="First name" />
			</Form.Item>

			<Form.Item
				label="Last name"
				name="lastName"
				rules={[
					{
						required: true,
						message: "Last name can't be blank",
					},
				]}
			>
				<Input placeholder="Last name" />
			</Form.Item>

			<Form.Item
				label="Email"
				name="email"
				rules={[
					{
						required: true,
						message: "Email can't be blank",
					},
					{
						type: "email",
						message: "Email isn't a valid email",
					},
				]}
			>
				<Input placeholder="Email" />
			</Form.Item>

			<Form.Item
				label="Phone number"
				name="phone"
				rules={[
					{
						required: true,
						message: "Phone number can't be blank",
					},
					{
						pattern:
							/^[\\+]?[(]?[0-9]{3}[)]?[-\s\\.]?[0-9]{3}[-\s\\.]?[0-9]{4,6}$/,
						message: "Phone must be a valid phone number",
					},
				]}
			>
				<Input placeholder="Phone number" />
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"
				rules={[
					{
						required: true,
						message: "Password can't be blank",
					},
					{
						min: 8,
						message: "Password is too short (minimum is 8 characters)",
					},
					{
						pattern:
							/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
						message:
							"Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
					},
				]}
			>
				<Input.Password placeholder="Password" />
			</Form.Item>

			<Form.Item
				label="Confirm password"
				name="confirmPassword"
				rules={[
					{
						required: true,
						message: "Confirm password can't be blank",
					},
				]}
			>
				<Input.Password placeholder="Confirm password" />
			</Form.Item>

			<Form.Item
				label="Address"
				name="address"
				rules={[
					{
						required: true,
						message: "Address can't be blank",
					},
				]}
			>
				<Input placeholder="Address" />
			</Form.Item>

			<Form.Item label="Avatar">
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
				<Button
					type="primary"
					htmlType="submit"
					className="bg-black flex items-center gap-2"
					disabled={isLoading}
				>
					{isLoading && <AiOutlineLoading3Quarters className="animate-spin" />}
					<span>Sign up</span>
				</Button>
			</Form.Item>
		</Form>
	);
};

export default SignUp;