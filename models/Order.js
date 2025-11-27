import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      _id: String,
      title: String,
      price: Number,
      qty: Number,
      imageUrl: String,
    }
  ],
  totalPrice: Number,
  address: {
    fullName: String,
    phone: String,
    house: String,
    city: String,
    state: String,
    pin: String,
  },
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
