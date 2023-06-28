import {
	Button,
	Checkbox,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Select,
	Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
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
	getAllServicesReducerAsync,
	selectService,
} from "../../redux/slice/service";
import { SELECT_TYPES, formatDateTime, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const PromotionCreate = () => {
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
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
		dispatch(getAllServicesReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const SELECT_SERVICES = services.map((service) => ({
		value: service._id,
		label: service.name,
	}));

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/promotion",
				{
					...values,
					startDate: moment(values.startDate).format(formatDateTime),
					endDate: moment(values.endDate).format(formatDateTime),
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				toast.success(data.message);
				navigate("/promotions");
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setIsLoading(false);

				if (data.name === "service") {
					formRef.current.setFields([
						{ name: "service", errors: [data.message] },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "name") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: [data.message] },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "description") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: [data.message] },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "type") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: [data.message] },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "startDate") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: [data.message] },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "endDate") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: [data.message] },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "value") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: [data.message] },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "maxUses") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: [data.message] },
						{ name: "isActive", errors: null },
					]);
				} else if (data.name === "isActive") {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "service", errors: null },
						{ name: "name", errors: null },
						{ name: "description", errors: null },
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
						{ name: "value", errors: null },
						{ name: "maxUses", errors: null },
						{ name: "isActive", errors: null },
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
				service: "",
				name: "",
				description: "",
				type: "Tỷ lệ phần trăm",
				startDate: "",
				endDate: "",
				value: "",
				maxUses: 1,
				isActive: false,
			}}
		>
			<Form.Item
				label="Dịch vụ"
				name="service"
				rules={[
					{
						required: true,
						message: "Dịch vụ không được để trống",
					},
				]}
			>
				<Select options={SELECT_SERVICES} />
			</Form.Item>

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

			<Form.Item label="Loại khuyến mãi" name="type">
				<Select options={SELECT_TYPES} />
			</Form.Item>

			<Form.Item
				label="Ngày bắt đầu"
				name="startDate"
				rules={[
					{
						required: true,
						message: "Ngày bắt đầu không được để trống",
					},
				]}
			>
				<DatePicker
					showTime
					format={formatDateTime}
					placeholder="Ngày bắt đầu"
				/>
			</Form.Item>

			<Form.Item
				label="Ngày kết thúc"
				name="endDate"
				rules={[
					{
						required: true,
						message: "Ngày kết thúc không được để trống",
					},
				]}
			>
				<DatePicker
					showTime
					format={formatDateTime}
					placeholder="Ngày kết thúc"
				/>
			</Form.Item>

			<Form.Item
				label="Giá trị"
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
				label="Số lần sử dụng tối đa"
				name="maxUses"
				rules={[
					{
						required: true,
						message: "Số lần sử dụng tối đa không được để trống",
					},
					{
						type: "number",
						min: 1,
						message: "Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1",
					},
				]}
			>
				<InputNumber
					style={{ width: "100%" }}
					placeholder="Số lần sử dụng tối đa"
				/>
			</Form.Item>

			<Form.Item name="isActive" valuePropName="checked">
				<Checkbox>Kích hoạt</Checkbox>
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

export default PromotionCreate;