import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	schedule: [],
};

export const scheduleSlice = createSlice({
	name: "schedule",
	initialState,
	reducers: {
		getAllScheduleReducer: (state, { payload }) => {
			if (payload.success) {
				state.schedule = payload.data;
			}
		},
	},
});

export const getAllScheduleReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/schedule",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllScheduleReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectSchedule = (state) => state.schedule;
export const { getAllScheduleReducer } = scheduleSlice.actions;
export default scheduleSlice.reducer;