import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import FooterWrapper from "./components/FooterWrapper";
import { Michroma, DM_Sans, Geist } from "next/font/google";
import SmoothScroll from "@/app/components/SmoothScroll";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Umer Ahmed - Portfolio",
  description:
    "Welcome to my personal portfolio! I'm Umer Ahmed, a passionate software developer with expertise in web development, mobile app development, and UI/UX design. Explore my projects, skills, and experience to see how I can help bring your ideas to life.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${michroma.className} antialiased`}>
        <SmoothScroll>
          <HeaderWrapper />
        </SmoothScroll>
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}