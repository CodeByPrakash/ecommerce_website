import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function PUT(req) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  let update = {};

  // Basic fields
  if (body.name) update.name = body.name;
  if (body.phone) update.phone = body.phone;

  // Secure nested address handling
  // ADDRESS MAPPING MATCHES SCHEMA
    if (body.address) {
    if (body.address.house) update["address.house"] = body.address.house;
    if (body.address.city)  update["address.city"]  = body.address.city;
    if (body.address.state) update["address.state"] = body.address.state;
    if (body.address.pin || body.address.pincode) 
        update["address.pin"] = body.address.pin || body.address.pincode;
    }



  // Password update (optional)
  if (body.password && body.password.length >= 6) {
    update.passwordHash = await bcrypt.hash(body.password, 10);
  }

  await User.findByIdAndUpdate(user._id, { $set: update }, { new: true });

  return NextResponse.json({ success: true, message: "Profile Updated" });
}
