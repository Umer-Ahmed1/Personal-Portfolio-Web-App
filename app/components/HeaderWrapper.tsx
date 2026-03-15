"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

// Routes where the header should be hidden
const HIDDEN_ON = ["/admin", "/admin/login"];

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Hide on exact matches or any sub-path of /admin
  const hide = pathname === "/admin/login" || pathname.startsWith("/admin");

  if (hide) return null;
  return <Header />;
}