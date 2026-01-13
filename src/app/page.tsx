//src\app\page.tsx

//Is this person logged in? If yes, go to Dashboard. If no, go to Login.

//Server-Side Redirect.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If logged in, send to the GOOD dashboard
    redirect("/dashboard");
  } else {
    // If NOT logged in, send to Login
    redirect("/login");
  }
}