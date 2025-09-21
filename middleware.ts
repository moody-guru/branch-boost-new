//It's a special file in Next.js that runs on every request and will be used to protect your /dashboard route, ensuring only authenticated users can access it.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";


export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Grab cookies
  const cookies = request.cookies;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ✅ Check the session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // 🚀 If not logged in and trying to access /dashboard → redirect to /login
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚀 If logged in and trying to access /login → redirect to /dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Replace your old config with this one for better performance
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*', // This covers the dashboard and any future sub-pages
  ],
};