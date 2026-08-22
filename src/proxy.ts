import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login");
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage) {
      if (isAuth && (token.role === "ADMIN" || token.role === "STAFF")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth && isAdminRoute) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminRoute && token?.role !== "ADMIN" && token?.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: () => true, // We handle the authorization in the middleware function above
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
