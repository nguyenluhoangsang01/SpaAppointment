import { Button, DatePicker, Form, InputNumber, Select, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
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
		if (user?.role !== "Quản trị viên") navigate("/");
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
				{ ...values },
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
				status: "Chưa hoạt động",
			}}
		>
			<Form.Item
				label="Tên khuyến mãi"
				name="promotionId"
				rules={[
					{
						required: true,
						message: "Khuyến mãi không được để trống",
					},
				]}
			>
				<Select options={SELECT_PROMOTION} />
			</Form.Item>

			<Form.Item
				label="Ngày hết hạn"
				name="expirationDate"
				rules={[
					{
						required: true,
						message: "Ngày hết hạn không được để trống",
					},
				]}
			>
				<DatePicker
					showTime
					format={formatDateTime}
					placeholder="Ngày hết hạn"
				/>
			</Form.Item>

			<Form.Item
				label="Giá trị (VND)"
				name="value"
				rules={[
					{
						required: true,
						message: "Giá trị không được để trống",
					},
					{
						type: "number",
						min: 1,
						message: "Giá trị phải lớn hơn hoặc bằng 1",
					},
				]}
			>
				<InputNumber style={{ width: "100%" }} placeholder="Giá trị" />
			</Form.Item>

			<Form.Item
				label="Trạng thái"
				name="status"
				rules={[
					{
						required: true,
						message: "Trạng thái không được để trống",
					},
				]}
			>
				<Select options={SELECT_STATUS} />
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

export default GiftCardCreate;