import { model, Schema } from "mongoose";
import { PROMOTION_TYPE } from "../constants.js";

const promotionSchema = new Schema(
	{
		codes: [
			{
				type: Schema.Types.ObjectId,
				ref: "GiftCard",
			},
		],
		description: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			require: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		maxUses: {
			type: Number,
			default: Infinity,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		service: {
			type: Schema.Types.ObjectId,
			require: true,
			ref: "Service",
		},
		startDate: {
			type: String,
			require: true,
		},
		totalUses: {
			type: Number,
			default: 0,
		},
		type: {
			type: String,
			enum: Object.values(PROMOTION_TYPE),
			default: PROMOTION_TYPE.Percentage,
		},
		value: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Promotion", promotionSchema);