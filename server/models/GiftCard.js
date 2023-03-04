import { model, Schema } from "mongoose";
import { GiFT_CARD_STATUS } from "../constants.js";

const giftCardSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GiFT_CARD_STATUS),
      default: GiFT_CARD_STATUS.Active,
    },
    dateRedeemed: Date,
    transactionHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    promotion: {
      type: Schema.Types.ObjectId,
      ref: "Promotion",
    },
  },
  { timestamps: true }
);

export default model("GiftCard", giftCardSchema);