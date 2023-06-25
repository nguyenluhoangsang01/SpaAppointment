import { model, Schema } from "mongoose";

const locationSchema = new Schema(
	{
		shortName: {
			type: String,
			required: true,
		},
		fullName: {
			type: String,
			required: true,
		},
		countLocation: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export default model("Location", locationSchema);