import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/ui/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BranchBoost Dashboard",
  description: "Manage your engineering tasks efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}
      >
        {/* Main Content Area - Grows to fill space */}
        <div className="flex-grow">{children}</div>

        {/* Footer - Always sticks to bottom because of flex-col & flex-grow above */}
        <Footer />
      </body>
    </html>
  );
}
