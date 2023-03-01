import { model, Schema } from "mongoose";
import { ROLES } from "../constants.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.Customer,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: String,
    availability: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        timezone: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
      },
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

export default model("User", userSchema);