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
	},
	{ timestamps: true }
);

export default model("Location", locationSchema);