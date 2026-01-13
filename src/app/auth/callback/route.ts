//Next.js Route Handler. It will receive the code from the URL, use your createServerComponentClient to exchange the code for a session, and then redirect the user to the /dashboard page.


// src/app/auth/callback/route.ts
// import { createServerClient as createClient } from "@/lib/supabase/server";
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const code = searchParams.get('code')

//   if (code) {
//     const supabase = createClient()
//     await supabase.auth.exchangeCodeForSession(code)
//   }

//   return NextResponse.redirect(new URL('/dashboard', request.url))
// }


// import { NextResponse } from "next/server";
// // We import 'createClient', not 'createServerClient'
// import { createClient } from "@/lib/supabase/server";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // if "next" is in param, use it as the redirect URL
//   const next = searchParams.get("next") ?? "/";

//   if (code) {
//     // We must AWAIT this because we updated server.ts to be async
//     const supabase = await createClient();

//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
//       const isLocalEnv = process.env.NODE_ENV === "development";
//       if (isLocalEnv) {
//         // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
//         return NextResponse.redirect(`${origin}${next}`);
//       } else if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`);
//       } else {
//         return NextResponse.redirect(`${origin}${next}`);
//       }
//     }
//   }

//   // return the user to an error page with instructions
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default redirect to dashboard after login
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Success! Redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error! Redirect to an error page (or back to login)
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}