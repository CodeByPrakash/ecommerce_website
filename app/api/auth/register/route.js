import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!password || (!email && !phone)) {
      return NextResponse.json({ message: "Email or phone + password required" }, { status: 400 });
    }

    // Build dynamic search object properly
    const search = {};
    if (email) search.email = email;
    if (phone) search.phone = phone;

    const existingUser = await User.findOne(search);
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ADMIN CHECK
    const role = email && process.env.ADMIN_EMAIL === email ? "admin" : "user";

    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      passwordHash,
      role,
    });

    // 🔥 MUST HAVE IN .env => JWT_SECRET="your-secret"
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({ message: "Registered successfully" }, { status: 201 });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });

    return res;

  } catch(err){
  console.log("REGISTER CRASH →", err);
  return NextResponse.json({ message:"Server crash", detail:String(err) },{status:500});
  }
}
