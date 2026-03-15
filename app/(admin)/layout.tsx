// app/(admin)/layout.tsx
import type { Metadata } from "next";
import { Michroma } from "next/font/google";
import "../globals.css";

const michroma = Michroma({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Admin — Umer Ahmed",
  robots: { index: false, follow: false }, // don't index admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No Header, no Footer — just the page content
  return (
    <div className={`${michroma.className} antialiased`}>
      {children}
    </div>
  );
}