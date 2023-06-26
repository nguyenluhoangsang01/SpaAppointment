import { Button, DatePicker, Form, InputNumber, Select, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import {
	getAllPromotionsReducerAsync,
	selectPromotion,
} from "../../redux/slice/promotion";
import { SELECT_STATUS, formatDateTime, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const GiftCardCreate = () => {
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { promotions } = useSelector(selectPromotion);
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
		if (user?.role !== "Admin") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		dispatch(getAllPromotionsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const SELECT_PROMOTION = promotions.map((service) => ({
		value: service._id,
		label: service.name,
	}));

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/gift-card",
				{
					...values,
					expirationDate: moment(values.expirationDate).format(formatDateTime),
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				toast.success(data.message);
				navigate("/gift-cards");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setIsLoading(false);

				if (data.name === "promotionId") {
					formRef.current.setFields([
						{ name: "promotionId", errors: [data.message] },
						{ name: "expirationDate", errors: null },
						{ name: "value", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "expirationDate") {
					formRef.current.setFields([
						{ name: "promotionId", errors: null },
						{ name: "expirationDate", errors: [data.message] },
						{ name: "value", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "value") {
					formRef.current.setFields([
						{ name: "promotionId", errors: null },
						{ name: "expirationDate", errors: null },
						{ name: "value", errors: [data.message] },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "status") {
					formRef.current.setFields([
						{ name: "promotionId", errors: null },
						{ name: "expirationDate", errors: null },
						{ name: "value", errors: null },
						{ name: "status", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "promotionId", errors: null },
						{ name: "expirationDate", errors: null },
						{ name: "value", errors: null },
						{ name: "status", errors: null },
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
				promotionId: "",
				expirationDate: "",
				value: "",
				status: "Active",
			}}
		>
			<Form.Item
				label="Promotion"
				name="promotionId"
				rules={[
					{
						required: true,
						message: "Promotion can't be blank",
					},
				]}
			>
				<Select options={SELECT_PROMOTION} />
			</Form.Item>

			<Form.Item
				label="Expiration date"
				name="expirationDate"
				rules={[
					{
						required: true,
						message: "Expiration date can't be blank",
					},
				]}
			>
				<DatePicker showTime format={formatDateTime} />
			</Form.Item>

			<Form.Item
				label="Value"
				name="value"
				rules={[
					{
						required: true,
						message: "Value can't be blank",
					},
					{
						type: "number",
						min: 1,
						message: "Value must be greater than or equal to 1",
					},
				]}
			>
				<InputNumber placeholder="Value" />
			</Form.Item>

			<Form.Item
				label="Status"
				name="status"
				rules={[
					{
						required: true,
						message: "Status can't be blank",
					},
				]}
			>
				<Select options={SELECT_STATUS} />
			</Form.Item>

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

export default GiftCardCreate;
