import { Button, Form, Input } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Dropzone from "../../components/Dropzone";
import RenderFile from "../../components/RenderFile";
import { selectAuth, updateProfile } from "../../redux/slice/auth";
import { layout } from "../../utils/constants";
import { axiosConfigFormData } from "../../utils/helpers";

const Profile = () => {
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	const dispatch = useDispatch();
	// Ref
	const formRef = useRef(null);
	// State
	const [isLoading, setIsLoading] = useState(false);
	const [avatar, setAvatar] = useState(null);
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
				"/user/profile",
				{ ...values, avatar },
				axiosConfigFormData(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(updateProfile(data));

				toast.success(data.message);

				setIsLoading(false);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "firstName") {
					formRef.current.setFields([
						{ name: "firstName", errors: [data.message] },
						{ name: "lastName", errors: null },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "lastName") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: [data.message] },
						{ name: "address", errors: null },
					]);
				} else if (data.name === "address") {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "address", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "firstName", errors: null },
						{ name: "lastName", errors: null },
						{ name: "address", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	return (
		<Form
			name="profile"
			layout="vertical"
			onFinish={onFinish}
			ref={formRef}
			{...layout}
			initialValues={{ ...user }}
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
					<span>Update</span>
				</Button>
			</Form.Item>
		</Form>
	);
};

export default Profile;