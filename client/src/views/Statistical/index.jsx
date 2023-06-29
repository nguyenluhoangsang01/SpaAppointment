import {
	AccumulationChartComponent,
	AccumulationDataLabel,
	AccumulationLegend,
	AccumulationSeriesCollectionDirective,
	AccumulationSeriesDirective,
	AccumulationTooltip,
	Inject,
	PieSeries,
} from "@syncfusion/ej2-react-charts";
import { Tabs } from "antd";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { selectLocation } from "../../redux/slice/location";
import { selectService } from "../../redux/slice/service";
import { getAllUsersReducerAsync, selectUser } from "../../redux/slice/user";

const Statistical = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { users } = useSelector(selectUser);
	const { services } = useSelector(selectService);
	const { locations } = useSelector(selectLocation);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	// Config charts
	const legendSettings = { visible: true };

	useEffect(() => {
		if (!user) navigate("/sign-in");
	}, [navigate, user]);

	useEffect(() => {
		dispatch(getAllUsersReducerAsync(accessToken, refreshToken));
	}, [accessToken, dispatch, refreshToken]);

	const countAppointment = users?.map((user) => ({
		name: `${user?.firstName} ${user?.lastName}`,
		numberOfAppointments: user?.countAppointment,
	}));

	const countPrice = users?.map((user) => ({
		name: `${user?.firstName} ${user?.lastName}`,
		price: user?.countPrice,
	}));

	const countService = services?.map((service) => ({
		name: service?.name,
		times: service?.countServices,
	}));

	const countStaff = users?.map((user) => ({
		name: `${user?.firstName} ${user?.lastName}`,
		times: user?.countStaff,
	}));

	const countLocation = locations?.map((location) => ({
		name: location?.fullName,
		times: location?.countLocation,
	}));

	const items = [
		{
			key: "1",
			label: `Cuộc hẹn`,
			children: (
				<AccumulationChartComponent
					id="countAppointment2"
					title="Cuộc hẹn"
					tooltip={{
						enable: true,
						shared: false,
						// eslint-disable-next-line no-template-curly-in-string
						format: "${point.x}: ${point.y} lần",
					}}
					enableSmartLabels={true}
					legendSettings={legendSettings}
					enableAnimation={true}
				>
					<Inject
						services={[
							PieSeries,
							AccumulationTooltip,
							AccumulationDataLabel,
							AccumulationLegend,
						]}
					/>

					<AccumulationSeriesCollectionDirective>
						<AccumulationSeriesDirective
							dataSource={countAppointment}
							xName="name"
							yName="numberOfAppointments"
							type="Pie"
						/>
					</AccumulationSeriesCollectionDirective>
				</AccumulationChartComponent>
			),
		},
		{
			key: "2",
			label: `Doanh thu`,
			children: (
				<AccumulationChartComponent
					id="price2"
					title="Doanh thu"
					tooltip={{
						enable: true,
						shared: false,
						// eslint-disable-next-line no-template-curly-in-string
						format: "${point.x}: ${point.y} VND",
					}}
					enableSmartLabels={true}
					legendSettings={legendSettings}
					enableAnimation={true}
				>
					<Inject
						services={[
							PieSeries,
							AccumulationTooltip,
							AccumulationDataLabel,
							AccumulationLegend,
						]}
					/>

					<AccumulationSeriesCollectionDirective>
						<AccumulationSeriesDirective
							dataSource={countPrice}
							xName="name"
							yName="price"
							type="Pie"
						/>
					</AccumulationSeriesCollectionDirective>
				</AccumulationChartComponent>
			),
		},

		{
			key: "3",
			label: `Dịch vụ`,
			children: (
				<AccumulationChartComponent
					id="price3"
					title="Dịch vụ"
					tooltip={{
						enable: true,
						shared: false,
						// eslint-disable-next-line no-template-curly-in-string
						format: "${point.x}: ${point.y} lần",
					}}
					enableSmartLabels={true}
					legendSettings={legendSettings}
					enableAnimation={true}
				>
					<Inject
						services={[
							PieSeries,
							AccumulationTooltip,
							AccumulationDataLabel,
							AccumulationLegend,
						]}
					/>

					<AccumulationSeriesCollectionDirective>
						<AccumulationSeriesDirective
							dataSource={countService}
							xName="name"
							yName="times"
							type="Pie"
						/>
					</AccumulationSeriesCollectionDirective>
				</AccumulationChartComponent>
			),
		},

		{
			key: "4",
			label: `Nhân viên`,
			children: (
				<AccumulationChartComponent
					id="price4"
					title="Nhân viên"
					tooltip={{
						enable: true,
						shared: false,
						// eslint-disable-next-line no-template-curly-in-string
						format: "${point.x}: ${point.y} lần",
					}}
					enableSmartLabels={true}
					legendSettings={legendSettings}
					enableAnimation={true}
				>
					<Inject
						services={[
							PieSeries,
							AccumulationTooltip,
							AccumulationDataLabel,
							AccumulationLegend,
						]}
					/>

					<AccumulationSeriesCollectionDirective>
						<AccumulationSeriesDirective
							dataSource={countStaff}
							xName="name"
							yName="times"
							type="Pie"
						/>
					</AccumulationSeriesCollectionDirective>
				</AccumulationChartComponent>
			),
		},

		{
			key: "5",
			label: `Địa điểm`,
			children: (
				<AccumulationChartComponent
					id="price5"
					title="Địa điểm"
					tooltip={{
						enable: true,
						shared: false,
						// eslint-disable-next-line no-template-curly-in-string
						format: "${point.x}: ${point.y} lần",
					}}
					enableSmartLabels={true}
					legendSettings={legendSettings}
					enableAnimation={true}
				>
					<Inject
						services={[
							PieSeries,
							AccumulationTooltip,
							AccumulationDataLabel,
							AccumulationLegend,
						]}
					/>

					<AccumulationSeriesCollectionDirective>
						<AccumulationSeriesDirective
							dataSource={countLocation}
							xName="name"
							yName="times"
							type="Pie"
						/>
					</AccumulationSeriesCollectionDirective>
				</AccumulationChartComponent>
			),
		},
	];

	return <Tabs defaultActiveKey="1" items={items} />;
};

export default Statistical;
