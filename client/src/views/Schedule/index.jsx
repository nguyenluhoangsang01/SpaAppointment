import allLocales from "@fullcalendar/core/locales-all";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button, Form, Select, Tooltip } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modals from "../../components/Modals";
import { selectAuth } from "../../redux/slice/auth";
import {
	SELECT_TYPES_SCHEDULE,
	formatDateTime,
	layout,
} from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const Schedule = () => {
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
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
		if (user?.role !== "Nhân viên" && user?.role !== "Quản trị viên") navigate("/");
	}, [navigate, user?.role]);

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
				"/schedule",
				{
					...values,
					startDate: moment(info.start).format(formatDateTime),
					endDate: moment(info.end).format(formatDateTime),
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

				if (data.name === "type") {
					formRef.current.setFields([
						{ name: "type", errors: [data.message] },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
					]);
				} else if (data.name === "startDate") {
					formRef.current.setFields([
						{ name: "type", errors: null },
						{ name: "startDate", errors: [data.message] },
						{ name: "endDate", errors: null },
					]);
				} else if (data.name === "endDate") {
					formRef.current.setFields([
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: [data.message] },
					]);
				} else {
					formRef.current.setFields([
						{ name: "type", errors: null },
						{ name: "startDate", errors: null },
						{ name: "endDate", errors: null },
					]);
				}
			}
		}
	};

	return (
		<>
			<div className="flex justify-end mb-4">
				<Tooltip title="Xem tất cả lịch trình">
					<Button
						onClick={() => navigate("/schedule/view-schedule")}
						className="bg-[green] text-white"
					>
						Xem tất cả lịch trình
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
				title="Tạo lịch làm việc mới"
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
					initialValues={{ type: "Đang nghỉ việc" }}
				>
					<Form.Item label="Loại làm việc" name="type">
						<Select options={SELECT_TYPES_SCHEDULE} />
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

export default Schedule;
