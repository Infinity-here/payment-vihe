import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    txnid: { type: String, required: true, unique: true },
    name: String,
    email: String,
    phone: String,
    amount: Number,
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    },
    payuResponse: Object
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
