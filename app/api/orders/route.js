import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await request.json();
    const { items, total, address } = body;

    await connectDB();

    const newOrder = await Order.create({
      userId: user._id,
      items,
      totalPrice: total,
      address
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
