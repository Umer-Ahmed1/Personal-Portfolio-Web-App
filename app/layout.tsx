import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { Michroma } from "next/font/google";
import SmoothScroll from "@/app/components/SmoothScroll";
import Footer from "./components/Footer";



const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Umer Ahmed - Portfolio",
  description: "Welcome to my personal portfolio! I'm Umer Ahmed, a passionate software developer with expertise in web development, mobile app development, and UI/UX design. Explore my projects, skills, and experience to see how I can help bring your ideas to life.",
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
    <html lang="en">
      <body
        className={`${michroma.className} antialiased` }
      >
                <SmoothScroll>
        <Header />
        </SmoothScroll>
        {children}
           <Footer />
    
      </body>
    </html>
  );
}
