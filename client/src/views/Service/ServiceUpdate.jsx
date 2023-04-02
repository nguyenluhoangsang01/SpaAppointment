import { Button, Form, Input, InputNumber } from "antd";
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
		if (user?.role !== "Admin") navigate("/");
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

				navigate("/services");

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
					label="Duration"
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

export default ServiceUpdate;