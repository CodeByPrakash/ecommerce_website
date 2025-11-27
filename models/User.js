import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: "user" },

  phone: { type: String, default: "" },
  address: {
    house: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pin: { type: String, default: "" },
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
