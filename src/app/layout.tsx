import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- This line loads all your Tailwind styles
import { Footer } from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BranchBoost",
  description: "Task Manager with Recommendation for Engineering Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
