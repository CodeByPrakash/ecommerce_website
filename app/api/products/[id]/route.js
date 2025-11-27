// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = params;
    const updates = await req.json();

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await requireAdmin();

    const { id } = params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
