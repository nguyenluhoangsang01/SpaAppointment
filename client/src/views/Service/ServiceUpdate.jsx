import { Button, Form, Input, InputNumber, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import Loading from "../../components/Loading";
import RenderFile from "../../components/RenderFile";
import { selectAuth } from "../../redux/slice/auth";
import { layout } from "../../utils/constants";
import { axiosConfig, axiosConfigFormData } from "../../utils/helpers";

const ServiceUpdate = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [service, setService] = useState(null);
	// Title
	const title = data?.name;
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
					`/service/${id}`,
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
				`/service/${id}`,
				{
					...values,
					service,
				},
				axiosConfigFormData(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);

				navigate(`/services/${id}/view-details`);

				setIsLoading(false);
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

export default ServiceUpdate;
