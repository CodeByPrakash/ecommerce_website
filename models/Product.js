// models/Product.js
import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,              // 📌 for filtering
  tags: [String],                // 📌 new tags
  imageUrl: String},
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
