import { Button, DatePicker, Form, InputNumber, Select, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { selectAuth } from "../../redux/slice/auth";
import { selectLocation } from "../../redux/slice/location";
import { selectSchedule } from "../../redux/slice/schedule";
import { selectService } from "../../redux/slice/service";
import {
	SELECT_APPOINTMENT_STATUS,
	formatDateTime,
	layout,
} from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const AppointmentUpdate = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
	const { locations } = useSelector(selectLocation);
	const { schedule } = useSelector(selectSchedule);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	// Title
	const title = data?.service?.name;
	// Ref
	const formRef = useRef(null);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/appointment/${id}`,
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

	const SELECT_SERVICES = services.map((service) => ({
		value: service._id,
		label: service.name,
	}));

	const SELECT_LOCATIONS = locations.map((location) => ({
		value: location._id,
		label: location.fullName,
	}));

	const SELECT_STAFF = schedule.map((user) => ({
		value: user.staff._id,
		label: `${user.staff.firstName} ${user.staff.lastName}`,
	}));

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				`/appointment/${id}`,
				{
					...values,
					startDate: moment(values.startDate.$d).format(formatDateTime),
					endDate: moment(values.endDate.$d).format(formatDateTime),
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				navigate(`/appointments/${id}/view-details`);
				toast.success(data.message);
			}
		} catch ({ response: { data } }) {
			if (!data.success) {
				setIsLoading(false);

				if (data.name === "serviceId") {
					formRef.current.setFields([
						{ name: "serviceId", errors: [data.message] },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "locationId") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: [data.message] },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "staffId") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: [data.message] },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "duration") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: [data.message] },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "note") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: [data.message] },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "status") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "locationId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				}
			}
		}
	};

	return (
		<>
			<h1 className="font-bold uppercase mb-8 text-2xl">Cập nhật: {title}</h1>

			<Form
				name="update"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{
					...data,
					serviceId: data?.service?._id,
					locationId: data?.location?._id,
					staffId: data?.staff?._id,
					startDate: moment(data.startDate, formatDateTime),
					endDate: moment(data.endDate, formatDateTime),
				}}
			>
				<Form.Item
					label="Dịch vụ"
					name="serviceId"
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
					label="Vị trí"
					name="locationId"
					rules={[
						{
							required: true,
							message: "Vị trí không được để trống",
						},
					]}
				>
					<Select options={SELECT_LOCATIONS} />
				</Form.Item>

				<Form.Item
					label="Nhân viên"
					name="staffId"
					rules={[
						{
							required: true,
							message: "Nhân viên không được để trống",
						},
					]}
				>
					<Select options={SELECT_STAFF} />
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
					label="Khoảng thời gian (giờ)"
					name="duration"
					rules={[
						{
							required: true,
							message: "Khoảng thời gian không được để trống",
						},
						{
							type: "number",
							min: 0,
							message: "Khoảng thời gian phải lớn hơn hoặc bằng 0",
						},
					]}
				>
					<InputNumber
						style={{ width: "100%" }}
						placeholder="Khoảng thời gian (giờ)"
					/>
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
					<Select options={SELECT_APPOINTMENT_STATUS} />
				</Form.Item>

				<Form.Item
					label="Ghi chú"
					name="note"
					rules={[
						{
							required: true,
							message: "Ghi chú không được để trống",
						},
					]}
				>
					<TextArea placeholder="Ghi chú" rows={8} />
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

export default AppointmentUpdate;
