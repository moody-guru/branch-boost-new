import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Determine the Base URL (Localhost vs Production)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
    ? `https://${forwardedHost}`
    : origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success! Redirect to dashboard
      return NextResponse.redirect(`${baseUrl}${next}`);
    } else {
      // Log the specific error to CloudWatch/Console
      console.error("Supabase Auth Error:", error.message);
      // Redirect to login with the SPECIFIC error message
      return NextResponse.redirect(
        `${baseUrl}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // No code found
  return NextResponse.redirect(`${baseUrl}/login?error=no_code_provided`);
}
