import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	locations: [],
};

export const locationSlice = createSlice({
	name: "location",
	initialState,
	reducers: {
		getAllLocationReducer: (state, { payload }) => {
			if (payload.success) {
				state.locations = payload.data;
			}
		},
	},
});

export const getAllLocationsReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/location",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllLocationReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectLocation = (state) => state.location;
export const { getAllLocationReducer } = locationSlice.actions;
export default locationSlice.reducer;