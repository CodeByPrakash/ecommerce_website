// app/api/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

// GET /api/users  → list all users (admin only)
export async function GET() {
  try {
    await connectDB();
    await requireAdmin();

    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
