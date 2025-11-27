import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "@/models/User";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    if (!process.env.JWT_SECRET) {
      console.error("⚠ JWT_SECRET is not defined in .env");
      return null;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    try {
      await connectDB();
    } catch (dbErr) {
      console.error("⚠ Failed to connect to MongoDB:", dbErr);
      return null;
    }

    const user = await User.findById(payload.userId).lean();
    return user || null;
  } catch (err) {
    console.error("⚠ getAuthUser error:", err);
    return null;
  }
}

// Only allow admins
export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
