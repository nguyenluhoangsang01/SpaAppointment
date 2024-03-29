import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";
import Loading from "../../components/Loading";
import { Button, Form, Input, Tooltip } from "antd";
import { layout } from "../../utils/constants";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LocationUpdate = () => {
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
	const title = data?.fullName;
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
					`/location/${id}`,
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
				`/location/${id}`,
				{
					...values,
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				toast.success(data.message);

				navigate(`/locations/${id}/view-details`);

				setIsLoading(false);
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

export default LocationUpdate;
