import { model, Schema } from "mongoose";
import { PROMOTION_TYPE } from "../constants.js";

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PROMOTION_TYPE),
      default: PROMOTION_TYPE.Percentage,
    },
    value: {
      type: Number,
      required: true,
    },
    codes: [
      {
        type: Schema.Types.ObjectId,
        ref: "GiftCard",
      },
    ],
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    totalUses: {
      type: Number,
      default: 0,
    },
    maxUses: {
      type: Number,
      default: Infinity,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  { timestamps: true }
);

export default model("Promotion", promotionSchema);