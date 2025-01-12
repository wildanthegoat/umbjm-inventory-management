// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no session is found, redirect to the login page
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  const isSuperAdmin = session.role === "SUPER_ADMIN";
  if (req.nextUrl.pathname.startsWith("/user") && !isSuperAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/barang",
    "/kategori",
    "/lokasi",
    "/user",
  ],
};
