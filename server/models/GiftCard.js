import { model, Schema } from "mongoose";
import { GiFT_CARD_STATUS } from "../constants.js";

const giftCardSchema = new Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
		},
		expirationDate: {
			type: String,
			required: true,
		},
		promotion: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Promotion",
		},
		status: {
			type: String,
			enum: Object.values(GiFT_CARD_STATUS),
			default: GiFT_CARD_STATUS["Chưa hoạt động"],
		},
		value: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("GiftCard", giftCardSchema);