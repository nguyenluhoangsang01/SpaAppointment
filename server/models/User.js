import { model, Schema } from "mongoose";
import { ROLES } from "../constants.js";

const userSchema = new Schema(
	{
		address: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: "https://i.pravatar.cc/300",
		},
		bio: String,
		email: {
			type: String,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		loggedInAt: String,
		loggedInIP: String,
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		role: {
			type: String,
			enum: Object.values(ROLES),
			default: ROLES["Khách hàng"],
		},
		countAppointment: {
			type: Number,
			default: 0,
		},
		countPrice: {
			type: Number,
			default: 0,
		},
		countStaff: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export default model("User", userSchema);