import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId: { type: String, sparse: true }, // ID từ cổng thanh toán
  method: {
    type: String,
    enum: ["COD", "VNPAY"],
    required: true
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },
  payment_info: { type: mongoose.Schema.Types.Mixed } // Lưu raw response/callback từ provider
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);