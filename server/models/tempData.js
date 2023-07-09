import { model, Schema } from "mongoose";

const tempDataSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		activeCode: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("TempData", tempDataSchema);