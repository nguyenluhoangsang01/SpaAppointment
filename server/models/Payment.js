import { model, Schema } from "mongoose";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "../constants.js";

const paymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD["Credit cards"],
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.Created,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Payment", paymentSchema);