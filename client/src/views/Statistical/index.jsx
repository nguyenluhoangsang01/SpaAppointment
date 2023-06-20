import {
	AccumulationChartComponent,
	AccumulationDataLabel,
	AccumulationLegend,
	AccumulationSeriesCollectionDirective,
	AccumulationSeriesDirective,
	AccumulationTooltip,
	Category,
	ChartComponent,
	ColumnSeries,
	DataLabel,
	Inject,
	PieSeries,
	SeriesCollectionDirective,
	SeriesDirective,
	Tooltip,
} from "@syncfusion/ej2-react-charts";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAuth } from "../../redux/slice/auth";
import { getAllUsersReducerAsync, selectUser } from "../../redux/slice/user";

const Statistical = () => {
	// Router
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { user, accessToken } = useSelector(selectAuth);
	const { users } = useSelector(selectUser);
	// Cookies
	const refreshToken = Cookies.get("refreshToken");

	// Config charts
	const tooltip = { enable: true, shared: false };
	const primaryXAxis = { valueType: "Category" };
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

	return (
		<div className="grid grid-cols-1 gap-20">
			<ChartComponent
				id="bookedAppointmentsColumn"
				title="Biểu đồ cột thể hiện tổng số cuộc hẹn đã đặt"
				tooltip={tooltip}
				primaryXAxis={primaryXAxis}
			>
				<Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

				<SeriesCollectionDirective>
					<SeriesDirective
						dataSource={countAppointment}
						xName="name"
						yName="numberOfAppointments"
						type="Column"
						pointColorMapping="color"
					/>
				</SeriesCollectionDirective>
			</ChartComponent>

			<ChartComponent
				id="price"
				title="Biểu đồ cột thể hiện tổng số tiền người dùng đã bỏ ra"
				tooltip={tooltip}
				primaryXAxis={primaryXAxis}
			>
				<Inject services={[ColumnSeries, Tooltip, DataLabel, Category]} />

				<SeriesCollectionDirective>
					<SeriesDirective
						dataSource={countPrice}
						xName="name"
						yName="price"
						type="Column"
						pointColorMapping="color"
					/>
				</SeriesCollectionDirective>
			</ChartComponent>

			<div className="grid grid-cols-2 justify-center">
				<AccumulationChartComponent
					id="countAppointment2"
					title="Biểu đồ tròn thể hiện tổng số cuộc hẹn đã đặt"
					tooltip={tooltip}
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

				<AccumulationChartComponent
					id="price2"
					title="Biểu đồ tròn thể hiện tổng số tiền người dùng đã bỏ ra"
					tooltip={tooltip}
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
			</div>
		</div>
	);
};

export default Statistical;
