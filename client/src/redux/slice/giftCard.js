import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	giftCards: [],
};

export const giftCardSlice = createSlice({
	name: "giftCard",
	initialState,
	reducers: {
		getAllGiftCardsReducer: (state, { payload }) => {
			if (payload.success) {
				state.giftCards = payload.data;
			}
		},
	},
});

export const getAllGiftCardsReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/gift-card",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllGiftCardsReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectGiftCard = (state) => state.giftCard;
export const { getAllGiftCardsReducer } = giftCardSlice.actions;
export default giftCardSlice.reducer;