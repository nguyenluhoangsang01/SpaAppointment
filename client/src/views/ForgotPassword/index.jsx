import { Button, Form, Image, Input, Tooltip } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { layout } from "../../utils/constants";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
	// State
	const [isLoading, setIsLoading] = useState(false);
	// Ref
	const formRef = useRef(null);
	// Router
	const navigate = useNavigate();

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch("/auth/forgot-password", {
				...values,
			});

			if (data.success) {
				toast.success(data.message);

				setIsLoading(false);

				navigate("/sign-in");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				if (data.name === "email") {
					formRef.current.setFields([
						{ name: "email", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([{ name: "email", errors: null }]);
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
				name="forgot-password"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{ email: "" }}
			>
				<Form.Item
					label="Enter your email to get password reset link."
					name="email"
					rules={[
						{
							required: true,
							message: "Email can't be blank",
						},
					]}
				>
					<Input placeholder="Email address" />
				</Form.Item>

				<Form.Item>
					<p>
						Already have an account?{" "}
						<Link to="/sign-in" className="cursor-pointer text-green-700">
							<u>Login here</u>
						</Link>
					</p>
					<p>
						New user?{" "}
						<Link to="/sign-up" className="cursor-pointer text-green-700">
							<u>Create an account</u>
						</Link>
					</p>
				</Form.Item>

				<Form.Item>
					<Tooltip title="Send link">
						<Button
							type="primary"
							htmlType="submit"
							className="bg-black flex items-center gap-2"
							disabled={isLoading}
						>
							{isLoading && (
								<AiOutlineLoading3Quarters className="animate-spin" />
							)}
							<span>Send link</span>
						</Button>
					</Tooltip>
				</Form.Item>
			</Form>
		</div>
	);
};

export default ForgotPassword;
