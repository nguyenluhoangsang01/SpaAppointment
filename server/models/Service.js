import { model, Schema } from "mongoose";

const serviceSchema = new Schema(
	{
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			default:
				"https://res.cloudinary.com/spaappointment/image/upload/v1678759857/service/9f328e9611d4b7e1fc09b7e0e16b47b4_nqxbu8.jpg",
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

export default model("Service", serviceSchema);
