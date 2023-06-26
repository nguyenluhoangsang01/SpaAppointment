import { Button, Form, Input, InputNumber, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import RenderFile from "../../components/RenderFile";
import { selectAuth } from "../../redux/slice/auth";
import { layout } from "../../utils/constants";
import { axiosConfigFormData } from "../../utils/helpers";

const ServiceCreate = () => {
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// Ref
	const formRef = useRef(null);
	// State
	const [service, setService] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/service",
				{ ...values, service },
				axiosConfigFormData(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				toast.success(data.message);
				navigate("/services");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setIsLoading(false);

				if (data.name === "name") {
					formRef.current.setFields([
						{ name: "name", errors: [data.message] },
						{ name: "price", errors: null },
						{ name: "duration", errors: null },
						{ name: "description", errors: null },
					]);
				} else if (data.name === "price") {
					formRef.current.setFields([
						{ name: "name", errors: null },
						{ name: "price", errors: [data.message] },
						{ name: "duration", errors: null },
						{ name: "description", errors: null },
					]);
				} else if (data.name === "duration") {
					formRef.current.setFields([
						{ name: "name", errors: null },
						{ name: "price", errors: null },
						{ name: "duration", errors: [data.message] },
						{ name: "description", errors: null },
					]);
				} else if (data.name === "description") {
					formRef.current.setFields([
						{ name: "name", errors: null },
						{ name: "price", errors: null },
						{ name: "duration", errors: null },
						{ name: "description", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "name", errors: null },
						{ name: "price", errors: null },
						{ name: "duration", errors: null },
						{ name: "description", errors: null },
					]);
				}
			}
		}
	};

	return (
		<Form
			name="create"
			layout="vertical"
			onFinish={onFinish}
			ref={formRef}
			{...layout}
			initialValues={{
				description: "",
				duration: "",
				service: "",
				name: "",
				price: "",
			}}
		>
			<Form.Item
				label="Name"
				name="name"
				rules={[
					{
						required: true,
						message: "Name can't be blank",
					},
				]}
			>
				<Input placeholder="Name" />
			</Form.Item>

			<Form.Item
				label="Price"
				name="price"
				rules={[
					{
						required: true,
						message: "Price can't be blank",
					},
					{
						type: "number",
						min: 0,
						message: "Price must be greater than or equal to 0",
					},
				]}
			>
				<InputNumber placeholder="Price" />
			</Form.Item>

			<Form.Item
				label="Duration (h)"
				name="duration"
				rules={[
					{
						required: true,
						message: "Duration can't be blank",
					},
					{
						type: "number",
						min: 0,
						message: "Duration must be greater than or equal to 0",
					},
				]}
			>
				<InputNumber placeholder="Duration" />
			</Form.Item>

			<Form.Item
				label="Description"
				name="description"
				rules={[
					{
						required: true,
						message: "Description can't be blank",
					},
				]}
			>
				<TextArea placeholder="Description" />
			</Form.Item>

			<Form.Item label="Image">
				<Dropzone setAvatar={setService} />
			</Form.Item>
			{service && (
				<Form.Item name="service">
					<RenderFile
						avatar={{
							format: service.type.split("/")[1],
							name: service.name,
							size: service.size,
						}}
					/>
				</Form.Item>
			)}

			<Form.Item>
				<Tooltip title="Create">
					<Button
						type="primary"
						htmlType="submit"
						className="bg-black flex items-center gap-2"
						disabled={isLoading}
					>
						{isLoading && (
							<AiOutlineLoading3Quarters className="animate-spin" />
						)}
						<span>Create</span>
					</Button>
				</Tooltip>
			</Form.Item>
		</Form>
	);
};

export default ServiceCreate;
