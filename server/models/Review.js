import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
	{
		appointment: {
			type: Schema.Types.ObjectId,
			ref: "Appointment",
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

	},
	{ timestamps: true }
);

export default model("Review", reviewSchema);