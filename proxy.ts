import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Helper function to verify token securely on the Edge
  const verifyAuth = async (token: string | undefined) => {
    if (!token) return null;
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch (error) {
      console.log("JWT Error:", error);
      return null;
    }
  };

  const token = request.cookies.get("token")?.value;

  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Verify the user once here if a token exists, so we don't call it multiple times
  const user = token ? await verifyAuth(token) : null;

  // ----------------------------------------------------
  // 1. PRODUCT ROUTES
  // ----------------------------------------------------
  if (pathname.startsWith("/product/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 2. ADMIN ROUTES (Must come before general /account)
  // ----------------------------------------------------
  if (pathname.startsWith("/account/admin")) {
    if (!user || user.role !== "admin") {
      // Redirect unauthorized users (or non-admins) to home
      return NextResponse.redirect(new URL("/home", request.url));
    }
    if (pathname === "/account/admin") {
      return NextResponse.redirect(
        new URL("/account/admin/dashboard", request.url),
      );
    }
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 3. GENERAL ACCOUNT ROUTES
  // ----------------------------------------------------
  if (pathname.startsWith("/account")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Only redirect if the path is exactly "/account"
    // This prevents the infinite redirect loop on "/account/information"
    if (pathname === "/account") {
      return NextResponse.redirect(
        new URL("/account/information", request.url),
      );
    }

    // Allow them to proceed to /account/information, /account/settings, etc.
    return NextResponse.next();
  }

  // ----------------------------------------------------
  // 4. AUTH ROUTES (Login/Register)
  // ----------------------------------------------------
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/product/:path*",
    "/account/admin/:path*",
    "/login",
    "/register",
    "/account/:path*", // Updated this to catch all sub-paths of account
  ],
};
