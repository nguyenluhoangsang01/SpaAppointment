import { Button, Form, Input, Select } from "antd";
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
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
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
		if (user?.role !== "Admin") navigate("/");
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

				navigate("/users");

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
			<h1 className="font-bold uppercase mb-8 text-2xl">Update: {title}</h1>

			<Form
				name="sign-up"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{ ...data }}
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

				<Form.Item label="Role" name="role">
					<Select options={SELECT_ROLES} />
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

				<Form.Item label="Bio" name="bio">
					<TextArea />
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
			</Form>
		</>
	);
};

export default UserUpdate;