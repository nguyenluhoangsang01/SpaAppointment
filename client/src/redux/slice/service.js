import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	services: [],
};

export const serviceSlice = createSlice({
	name: "service",
	initialState,
	reducers: {
		getAllServicesReducer: (state, { payload }) => {
			if (payload.success) {
				state.services = payload.data;
			}
		},
	},
});

export const getAllServicesReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/service",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllServicesReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectService = (state) => state.service;
export const { getAllServicesReducer } = serviceSlice.actions;
export default serviceSlice.reducer;