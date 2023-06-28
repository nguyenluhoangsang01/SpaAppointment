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
		if (user?.role !== "Quản trị viên") navigate("/");
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
				label="Tên"
				name="name"
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
				label="Giá"
				name="price"
				rules={[
					{
						required: true,
						message: "Giá không được để trống",
					},
					{
						type: "number",
						min: 0,
						message: "Giá phải lớn hơn hoặc bằng 0",
					},
				]}
			>
				<InputNumber style={{ width: "100%" }} placeholder="Giá" />
			</Form.Item>

			<Form.Item
				label="Khoảng thời gian (giờ)"
				name="duration"
				rules={[
					{
						required: true,
						message: "Khoảng thời gian không được để trống",
					},
					{
						type: "number",
						min: 0,
						message: "Khoảng thời gian phải lớn hơn hoặc bằng 0",
					},
				]}
			>
				<InputNumber
					style={{ width: "100%" }}
					placeholder="Khoảng thời gian (giờ)"
				/>
			</Form.Item>

			<Form.Item
				label="Mô tả"
				name="description"
				rules={[
					{
						required: true,
						message: "Mô tả không được để trống",
					},
				]}
			>
				<TextArea placeholder="Mô tả" rows={8} />
			</Form.Item>

			<Form.Item label="Hình ảnh">
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
				<Tooltip title="Tạo">
					<Button
						type="primary"
						htmlType="submit"
						className="bg-black flex items-center gap-2"
						disabled={isLoading}
					>
						{isLoading && (
							<AiOutlineLoading3Quarters className="animate-spin" />
						)}
						<span>Tạo</span>
					</Button>
				</Tooltip>
			</Form.Item>
		</Form>
	);
};

export default ServiceCreate;
