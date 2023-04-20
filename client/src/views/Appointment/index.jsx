import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Form, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import {
	getAllServicesReducerAsync,
	selectService,
} from "../../redux/slice/service";
import { getAllUsersReducerAsync, selectUser } from "../../redux/slice/user";
import { formatDateTime, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const Appointment = () => {
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
	const { users } = useSelector(selectUser);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [datetime, setDatetime] = useState({ start: "", end: "" });
	// Ref
	const formRef = useRef(null);
	// Router
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllServicesReducerAsync(accessToken, refreshToken));
		dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

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

	const onCancel = () => {
		setOpen(false);
	};

	const handleSelect = (info) => {
		const { start, end } = info;

		setOpen(true);
		setDatetime({ start, end });
	};

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/appointment",
				{
					...values,
					startDate: moment(datetime.start).format(formatDateTime),
					endDate: moment(datetime.end).format(formatDateTime),
					emailTo: user?.email,
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				setOpen(false);
				toast.success(data.message);
				formRef.current.resetFields();
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
			<div className="flex justify-end mb-4">
				<Button
					onClick={() => navigate("/appointments/view-appointments")}
					className="bg-[green] text-white"
				>
					View all appointments
				</Button>
			</div>

			<FullCalendar
				editable
				selectable
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				headerToolbar={{
					start: "today prev next",
					center: "title",
					end: "dayGridMonth dayGridWeek dayGridDay",
				}}
				initialView="dayGridMonth"
				views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
				select={handleSelect}
			/>

			<Modals
				title="Create new appointment"
				open={open}
				confirmLoading={isLoading}
				onCancel={onCancel}
				footer={null}
			>
				<Form
					name="create"
					layout="vertical"
					onFinish={onFinish}
					ref={formRef}
					{...layout}
					initialValues={{
						serviceId: "",
						staffId: "",
						title: "",
						duration: "",
						note: "",
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
							<span>Create</span>
						</Button>
					</Form.Item>
				</Form>
			</Modals>
		</>
	);
};

export default Appointment;