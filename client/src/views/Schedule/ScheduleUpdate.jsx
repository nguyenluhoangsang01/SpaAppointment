import { Button, DatePicker, Form, Select, Tooltip } from "antd";
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
import {
	SELECT_TYPES_SCHEDULE,
	formatDateTime,
	layout,
} from "../../utils/constants";
import { axiosConfig } from "../../utils/helpers";

const ScheduleUpdate = () => {
	// Get id from params
	const { id } = useParams();
	// Redux
	const { user, accessToken } = useSelector(selectAuth);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");
	// Router
	const navigate = useNavigate();
	// State
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	// Title
	const title = `${user?.firstName} ${user?.lastName}`;
	// Ref
	const formRef = useRef(null);

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		if (user?.role !== "Nhân viên" && user?.role !== "Quản trị viên") navigate("/");
	}, [navigate, user?.role]);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await axios.get(
					`/schedule/${id}`,
					axiosConfig(accessToken, refreshToken)
				);

				if (data.success) {
					setData(data.data);
				}
			} catch ({ response: { data } }) {
				alert(data.message);
			}
		})();
	}, [accessToken, id, refreshToken]);

	if (!data) return <Loading />;

	const onFinish = async (values) => {
		setIsLoading(true);

		try {
			const { data } = await axios.patch(
				`/schedule/${id}`,
				{
					...values,
					startDate: moment(values.start).format(formatDateTime),
					endDate: moment(values.end).format(formatDateTime),
				},
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				setIsLoading(false);
				navigate(`/schedule/${id}/view-details`);
				toast.success(data.message);
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
			<h1 className="font-bold uppercase mb-8 text-2xl">Cập nhật: {title}</h1>

			<Form
				name="update"
				layout="vertical"
				onFinish={onFinish}
				ref={formRef}
				{...layout}
				initialValues={{
					...data,
					serviceId: data?.type,
					startDate: moment(data.startDate, formatDateTime),
					endDate: moment(data.endDate, formatDateTime),
				}}
			>
				<Form.Item label="Loại làm việc" name="type">
					<Select options={SELECT_TYPES_SCHEDULE} />
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

export default ScheduleUpdate;
