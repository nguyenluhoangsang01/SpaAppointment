import { model, Schema } from "mongoose";
import { SCHEDULE_TYPE } from "../constants.js";

const scheduleSchema = new Schema(
	{
		staff: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		type: {
			type: String,
			enum: Object.values(SCHEDULE_TYPE),
			default: SCHEDULE_TYPE.OnVacation,
		},
		startDate: {
			type: String,
			required: true,
		},
		endDate: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Schema", scheduleSchema);