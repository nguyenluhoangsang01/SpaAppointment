import { model, Schema } from "mongoose";

const serviceSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

export default model("Service", serviceSchema);