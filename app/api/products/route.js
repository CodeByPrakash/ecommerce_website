// app/api/products/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

// GET /api/products  → list products (public)
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products  → create product (admin only)
export async function POST(req) {
  try {
    await connectDB();
    await requireAdmin(); // throws if not admin

    const body = await req.json();
    const { title, description, price, imageUrl, category, inStock = true } = body;

    if (!title || price == null) {
      return NextResponse.json(
        { message: "Title and price are required" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      title,
      description,
      price,
      imageUrl,
      category,
      inStock,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
