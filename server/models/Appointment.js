import { model, Schema } from "mongoose";
import { APPOINTMENT_STATUS } from "../constants.js";

const appointmentSchema = new Schema(
	{
		services: [
			{
				type: Schema.Types.ObjectId,
				ref: "Service",
				required: true,
			},
		],
		date: {
			type: Date,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(APPOINTMENT_STATUS),
			default: APPOINTMENT_STATUS.Booked,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Appointment", appointmentSchema);