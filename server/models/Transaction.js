import { model, Schema } from "mongoose";
import { TRANSACTION_STATUS } from "../constants.js";

const transactionSchema = new Schema(
	{
		amount: {
			type: Number,
			required: true,
		},
		paymentMethod: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(TRANSACTION_STATUS),
			default: TRANSACTION_STATUS.Pending,
		},
		appointment: {
			type: Schema.Types.ObjectId,
			ref: "Appointment",
			required: true,
		},
		user: {
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

export default model("Transaction", transactionSchema);