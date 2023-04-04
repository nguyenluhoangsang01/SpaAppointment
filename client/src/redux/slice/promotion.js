import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosConfig } from "../../utils/helpers";

const initialState = {
	promotions: [],
};

export const promotionSlice = createSlice({
	name: "promotion",
	initialState,
	reducers: {
		getAllPromotionsReducer: (state, { payload }) => {
			if (payload.success) {
				state.promotions = payload.data;
			}
		},
	},
});

export const getAllPromotionsReducerAsync =
	(accessToken, refreshToken) => async (dispatch) => {
		try {
			const { data } = await axios.get(
				"/promotion",
				axiosConfig(accessToken, refreshToken)
			);

			if (data.success) {
				dispatch(getAllPromotionsReducer(data));
			}
		} catch (error) {
			console.log(error);
		}
	};

export const selectPromotion = (state) => state.promotion;
export const { getAllPromotionsReducer } = promotionSlice.actions;
export default promotionSlice.reducer;