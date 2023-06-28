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

const LocationCreate = () => {
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// Ref
	const formRef = useRef(null);
	// State
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
				"/location",
				{ ...values },
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				toast.success(data.message);
				navigate("/locations");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setIsLoading(false);

				if (data.name === "fullName") {
					formRef.current.setFields([
						{ name: "fullName", errors: [data.message] },
						{ name: "shortName", errors: null },
					]);
				} else if (data.name === "price") {
					formRef.current.setFields([
						{ name: "name", errors: null },
						{ name: "shortName", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "fullName", errors: null },
						{ name: "shortName", errors: null },
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
				fullName: "",
				shortName: "",
			}}
		>
			<Form.Item
				label="Tên đầy đủ"
				name="fullName"
				rules={[
					{
						required: true,
						message: "Tên đầy đủ không được để trống",
					},
				]}
			>
				<Input placeholder="Tên đầy đủ" />
			</Form.Item>

			<Form.Item
				label="Tên viết tắt"
				name="shortName"
				rules={[
					{
						required: true,
						message: "Tên viết tắt không được để trống",
					},
				]}
			>
				<Input placeholder="Tên viết tắt" />
			</Form.Item>

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

export default LocationCreate;