import { cookies } from "next/headers";

export const createServerClient = () => {
  const cookieStore = cookies(); // ✅ no await here

  return {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // implement your set logic if needed
        } catch (error) {
          console.error("Cookie set error:", error);
        }
      },
    },
  };
};
