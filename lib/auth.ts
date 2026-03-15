// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

// ── Admin credential check (from .env) ────────────────────────────────────────
export function verifyAdminCredentials(username: string, password: string): boolean {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

// ── JWT ───────────────────────────────────────────────────────────────────────
export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function getAdminToken(req: NextRequest): string | null {
  return req.cookies.get("admin_token")?.value ?? null;
}

// ── Client ID + password generators ──────────────────────────────────────────
export function generateClientId(): string {
  const year = new Date().getFullYear();
  const rand = randomBytes(2).toString("hex").toUpperCase();
  return `UA-${year}-${rand}`;
}

export function generateClientPassword(): string {
  // 8 lowercase hex chars — easy to type, hard enough to guess
  return randomBytes(4).toString("hex");
}