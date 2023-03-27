import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
	accessToken: null,
	user: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		signInReducer: (state, { payload }) => {
			if (payload.success) {
				state.accessToken = payload.data.accessToken;
				state.user = payload.data.user;
				Cookies.set("refreshToken", payload.data.refreshToken, { expires: 7 });
			}
		},
		signOutReducer: (state, { payload }) => {
			if (payload.success) {
				state.accessToken = null;
				state.user = null;
			}
		},
	},
});

export const selectAuth = (state) => state.auth;
export const { signInReducer, signOutReducer } = authSlice.actions;
export default authSlice.reducer;