import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { selectAuth } from "../../redux/slice/auth";
import {
	getAllPromotionsReducerAsync,
	selectPromotion,
} from "../../redux/slice/promotion";
import { SELECT_STATUS, formatDateTime, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const GiftCardUpdate = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
	const { promotions } = useSelector(selectPromotion);
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	// Title
	const title = data?.code;
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
		dispatch(getAllPromotionsReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const SELECT_PROMOTION = promotions.map((service) => ({
		value: service._id,
		label: service.name,
	}));

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/gift-card/${id}`,
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
				`/gift-card/${id}`,
				{
					...values,
					expirationDate: moment(values.expirationDate).format(formatDateTime),
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				toast.success(data.message);
				navigate(`/gift-cards/${id}/view-details`);
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
				...data,
				promotionId: data?.promotion?._id,
				expirationDate: moment(data.expirationDate, formatDateTime),
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

export default GiftCardUpdate;