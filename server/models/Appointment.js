import { model, Schema } from "mongoose";
import { APPOINTMENT_STATUS } from "../constants.js";

const appointmentSchema = new Schema(
	{
		duration: {
			type: Number,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
		note: String,
		service: {
			type: Schema.Types.ObjectId,
			ref: "Service",
			required: true,
		},
		startDate: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(APPOINTMENT_STATUS),
			default: APPOINTMENT_STATUS.Booked,
		},
		title: {
			type: String,
			required: true,
		},
		staff: {
			type: Schema.Types.ObjectId,
			ref: "User",
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

export default model("Appointment", appointmentSchema);