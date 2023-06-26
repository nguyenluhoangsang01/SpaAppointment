import { Button, Form, Image, Input, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import validate from "validate.js";
import { selectAuth, signInReducer } from "../../redux/slice/auth";
import { layout, phoneRegex } from "../../utils/constants";

const SignIn = () => {
	// Ref
	const formRef = useRef(null);
	// State
	const [isLoading, setIsLoading] = useState(false);
	// Redux
	const { user } = useSelector(selectAuth);
	const dispatch = useDispatch();
	// Router
	const navigate = useNavigate();

	useEffect(() => {
		if (user) navigate("/");
	}, [navigate, user]);

	const onFinish = async (values) => {
		setIsLoading(true);

		let email, phone;
		const emailValidate = validate.single(values.emailOrPhone, {
			presence: { allowEmpty: false },
			email: true,
		});
		const phoneValidate = validate.single(values.emailOrPhone, {
			presence: { allowEmpty: false },
			format: { pattern: phoneRegex, message: "must be a valid phone number" },
		});
		if (!emailValidate || !phoneValidate) {
			if (!emailValidate) {
				email = values.emailOrPhone;
			} else {
				phone = values.emailOrPhone;
			}
		}

		try {
			const { data } = await axios.post("/auth/login", {
				email,
				phone,
				password: values.password,
			});

			if (data.success) {
				toast.success(data.message);

				dispatch(signInReducer(data));

				setIsLoading(false);

				navigate("/");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "emailOrPhone") {
					formRef.current.setFields([
						{ name: "emailOrPhone", errors: [data.message] },
						{ name: "password", errors: null },
					]);
				} else if (data.name === "password") {
					formRef.current.setFields([
						{ name: "emailOrPhone", errors: null },
						{ name: "password", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "emailOrPhone", errors: null },
						{ name: "password", errors: null },
					]);
				}

				setIsLoading(false);
			}
		}
	};

	return (
		<div className="relative">
			<div className="mb-8">
				<Image
					src="https://www.picktime.com/webassets/2021/img/picktime-hero-new.svg"
					alt="Spa Appointment App"
					preview={false}
				/>
			</div>

			<Form
				name="sign-in"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{ email: "", phone: "", password: "" }}
			>
				<Form.Item
					label="Email / phone"
					name="emailOrPhone"
					rules={[
						{
							required: true,
							message: "Email / phone can't be blank",
						},
					]}
				>
					<Input placeholder="Email or phone" />
				</Form.Item>

				<Form.Item
					label="Password"
					name="password"
					rules={[
						{
							required: true,
							message: "Password can't be blank",
						},
					]}
				>
					<Input.Password placeholder="Password" />
				</Form.Item>

				<Form.Item className="cursor-pointer">
					<Link to="/forgot-password">
						<i>
							<u>Forgotten your password?</u>
						</i>
					</Link>
				</Form.Item>

				<Form.Item>
					<Tooltip title="Sign in">
						<Button
							type="primary"
							htmlType="submit"
							className="bg-black flex items-center gap-2"
							disabled={isLoading}
						>
							{isLoading && (
								<AiOutlineLoading3Quarters className="animate-spin" />
							)}
							<span>Sign in</span>
						</Button>
					</Tooltip>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SignIn;