import { createSlice } from "@reduxjs/toolkit";

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
			}
		},
	},
});

export const selectAuth = (state) => state.auth;
export const { signInReducer } = authSlice.actions;
export default authSlice.reducer;