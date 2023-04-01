import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	users: [],
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		getAllUsersReducer: (state, { payload }) => {
			if (payload.success) {
				state.users = payload.data;
			}
		},
	},
});

export const getAllUsersReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/user",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllUsersReducer(data));
			}
		} catch ({ response: { data } }) {
			alert(data.message);
		}
	};

export const selectUser = (state) => state.user;
export const { getAllUsersReducer } = userSlice.actions;
export default userSlice.reducer;