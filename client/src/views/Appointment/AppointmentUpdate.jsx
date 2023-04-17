import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { selectAuth } from "../../redux/slice/auth";
import { selectService } from "../../redux/slice/service";
import { selectUser } from "../../redux/slice/user";
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
	const { user, accessToken, refreshToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
	const { users } = useSelector(selectUser);
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	// Title
	const title = data?.title;
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

	const SELECT_STAFF = users
		.filter((user) => user.role === "Staff")
		.map((user) => ({
			value: user._id,
			label: `${user.firstName} ${user.lastName}`,
		}));

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				`/appointment/${id}`,
				{
					...values,

					startDate: moment(values.start).format(formatDateTime),
					endDate: moment(values.end).format(formatDateTime),
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
						{ name: "staffId", errors: null },
						{ name: "title", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "staffId") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: [data.message] },
						{ name: "title", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "title") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "title", errors: [data.message] },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "duration") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "title", errors: null },
						{ name: "duration", errors: [data.message] },
						{ name: "note", errors: null },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "note") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "title", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: [data.message] },
						{ name: "status", errors: null },
					]);
				} else if (data.name === "status") {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "title", errors: null },
						{ name: "duration", errors: null },
						{ name: "note", errors: null },
						{ name: "status", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "serviceId", errors: null },
						{ name: "staffId", errors: null },
						{ name: "title", errors: null },
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
			<h1 className="font-bold uppercase mb-8 text-2xl">Update: {title}</h1>

			<Form
				name="create"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{
					...data,
					serviceId: data?.service?._id,
					staffId: data?.staff?._id,
					startDate: moment(data.startDate, formatDateTime),
					endDate: moment(data.endDate, formatDateTime),
				}}
			>
				<Form.Item
					label="Service"
					name="serviceId"
					rules={[
						{
							required: true,
							message: "Service can't be blank",
						},
					]}
				>
					<Select options={SELECT_SERVICES} />
				</Form.Item>

				<Form.Item
					label="Staff"
					name="staffId"
					rules={[
						{
							required: true,
							message: "Service can't be blank",
						},
					]}
				>
					<Select options={SELECT_STAFF} />
				</Form.Item>

				<Form.Item
					label="Title"
					name="title"
					rules={[
						{
							required: true,
							message: "Title can't be blank",
						},
					]}
				>
					<Input placeholder="Title" />
				</Form.Item>

				<Form.Item
					label="Start date"
					name="startDate"
					rules={[
						{
							required: true,
							message: "Start date can't be blank",
						},
					]}
				>
					<DatePicker showTime format={formatDateTime} />
				</Form.Item>

				<Form.Item
					label="End date"
					name="endDate"
					rules={[
						{
							required: true,
							message: "End date can't be blank",
						},
					]}
				>
					<DatePicker showTime format={formatDateTime} />
				</Form.Item>

				<Form.Item
					label="Duration"
					name="duration"
					rules={[
						{
							required: true,
							message: "Duration can't be blank",
						},
						{
							type: "number",
							min: 0,
							message: "Duration must be greater than or equal to 0",
						},
					]}
				>
					<InputNumber placeholder="Duration" />
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
					<Select options={SELECT_APPOINTMENT_STATUS} />
				</Form.Item>

				<Form.Item
					label="Note"
					name="note"
					rules={[
						{
							required: true,
							message: "Note can't be blank",
						},
					]}
				>
					<TextArea placeholder="Note" />
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="bg-black flex items-center gap-2"
						disabled={isLoading}
					>
						{isLoading && (
							<AiOutlineLoading3Quarters className="animate-spin" />
						)}
						<span>Update</span>
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default AppointmentUpdate;