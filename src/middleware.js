import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Redirect "/" to "/login" if the user is not logged in
  if (pathname === "/") {
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    } else {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Redirect to login if no session is found and the path requires authentication
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isSuperAdmin = session.role === "SUPER_ADMIN";

  // Restrict access to "/user" for non-SUPER_ADMIN roles
  if (pathname.startsWith("/user") && !isSuperAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/barang",
    "/kategori",
    "/lokasi",
    "/user",
  ],
};
