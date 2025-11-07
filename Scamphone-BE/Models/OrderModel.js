import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true } // Lưu lại giá tại thời điểm mua
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total_amount: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    phone_number: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "completed", "cancelled", "refunded"],
        default: "pending"
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);