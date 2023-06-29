import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Form, InputNumber, Select, Tooltip } from "antd";
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
import { getAllAppointmentsReducerAsync } from "../../redux/slice/appointment";
import { selectAuth } from "../../redux/slice/auth";
import {
	getAllLocationsReducerAsync,
	selectLocation,
} from "../../redux/slice/location";
import {
	getAllScheduleReducerAsync,
	selectSchedule,
} from "../../redux/slice/schedule";
import {
	getAllServicesReducerAsync,
	selectService,
} from "../../redux/slice/service";
import { getAllUsersReducerAsync } from "../../redux/slice/user";
import { formatDateTime, layout } from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const Appointment = () => {
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { services } = useSelector(selectService);
	const { locations } = useSelector(selectLocation);
	const { schedule } = useSelector(selectSchedule);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// State
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [info, setInfo] = useState(null);
	// Ref
	const formRef = useRef(null);
	// Router
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
		dispatch(getAllServicesReducerAsync(accessToken, refreshToken));
		dispatch(getAllAppointmentsReducerAsync(accessToken, refreshToken));
		dispatch(getAllLocationsReducerAsync(accessToken, refreshToken));
		dispatch(getAllScheduleReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const SELECT_SERVICES = services.map((service) => ({
		value: service?._id,
		label: service?.name,
	}));

	const SELECT_STAFF = schedule
		?.filter(
			(item) => item?.staff?._id !== user?._id && item?.type === "Đang làm việc"
		)
		?.map((user) => ({
			value: user?.staff?._id,
			label: `${user?.staff?.firstName} ${user?.staff?.lastName}`,
		}));

	const SELECT_LOCATIONS = locations.map((location) => ({
		value: location?._id,
		label: location?.fullName,
	}));

	const onCancel = () => {
		setOpen(false);
	};

	const handleSelect = (info) => {
		setOpen(true);
		setInfo(info);
	};

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"/appointment",
				{
					...values,
					startDate: moment(info.start).format(formatDateTime),
					endDate: moment(info.end).format(formatDateTime),
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
			<div className="flex justify-end mb-4">
				<Tooltip title="Xem tất cả cuộc hẹn">
					<Button
						onClick={() => navigate("/appointments/view-appointments")}
						className="bg-[green] text-white"
					>
						Xem tất cả cuộc hẹn
					</Button>
				</Tooltip>
			</div>

			<FullCalendar
				editable
				selectable
				select={handleSelect}
				headerToolbar={{
					start: "today prev next",
					center: "title",
					end: "dayGridMonth dayGridWeek dayGridDay",
				}}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
				initialView="dayGridMonth"
				locales={allLocales}
				locale={"vi"}
			/>

			<Modals
				title="Tạo cuộc hẹn"
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
						duration: "",
						note: "",
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

					<Form.Item label="Ghi chú" name="note">
						<TextArea placeholder="Ghi chú" rows={8} />
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
			</Modals>
		</>
	);
};

export default Appointment;
