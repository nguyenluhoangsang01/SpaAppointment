import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	appointments: [],
};

export const appointmentSlice = createSlice({
	name: "appointment",
	initialState,
	reducers: {
		getAllAppointmentsReducer: (state, { payload }) => {
			if (payload.success) {
				state.appointments = payload.data;
			}
		},
	},
});

export const getAllAppointmentsReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/appointment",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllAppointmentsReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectAppointment = (state) => state.appointment;
export const { getAllAppointmentsReducer } = appointmentSlice.actions;
export default appointmentSlice.reducer;