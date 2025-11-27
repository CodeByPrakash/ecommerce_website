import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,               // 🔥 Forces remove
    expires: new Date(0),    // 🔥 Double-kill cookie
  });

  return response;
}
