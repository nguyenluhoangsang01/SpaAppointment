import { model, Schema } from "mongoose";
import { PROMOTION_TYPE } from "../constants.js";

const promotionSchema = new Schema(
	{
		description: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		maxUses: {
			type: Number,
			default: 1,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		service: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "Service",
		},
		startDate: {
			type: String,
			required: true,
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