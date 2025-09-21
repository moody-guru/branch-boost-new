import { createMiddlewareClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create a response object that we can modify
  const response = NextResponse.next();

  // Create a Supabase client that can be used in the middleware
  const supabase = createMiddlewareClient(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    {
      request,
      response,
    }
  );

  // This will refresh the user's session if it's expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // If the user is not logged in and is trying to access a protected route, redirect to login
  if (!session && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the user is logged in and is trying to access the login page, redirect to the dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
