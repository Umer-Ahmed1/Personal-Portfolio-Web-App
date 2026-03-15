// app/api/debug/route.ts
// TEMPORARY — delete this file after fixing the connection issue
import { NextResponse } from "next/server";
import dns from "dns/promises";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars
  results.MONGODB_URI_present  = !!process.env.MONGODB_URI;
  results.MONGODB_URI_starts   = process.env.MONGODB_URI?.slice(0, 50) + "...";
  results.JWT_SECRET_present   = !!process.env.JWT_SECRET;
  results.GMAIL_USER_present   = !!process.env.GMAIL_USER;
  results.NODE_ENV             = process.env.NODE_ENV;

  // 2. Parse hostname from URI
  let atlasHost = "";
  try {
    const uri = process.env.MONGODB_URI || "";
    // mongodb+srv://user:pass@hostname/db
    const match = uri.match(/@([^/?]+)/);
    atlasHost = match?.[1] || "could not parse";
    results.atlas_hostname = atlasHost;
  } catch (e) {
    results.atlas_hostname_parse_error = String(e);
  }

  // 3. DNS lookup of Atlas SRV record
  if (atlasHost && atlasHost !== "could not parse") {
    try {
      const srv = await dns.resolveSrv(`_mongodb._tcp.${atlasHost}`);
      results.dns_srv_lookup = "✅ success";
      results.dns_srv_records = srv.slice(0, 2); // first 2 records
    } catch (e: unknown) {
      results.dns_srv_lookup = "❌ FAILED";
      results.dns_srv_error  = (e as Error).message;
    }

    // Also try plain A record
    try {
      const a = await dns.lookup(atlasHost);
      results.dns_a_lookup = "✅ success — " + a.address;
    } catch (e: unknown) {
      results.dns_a_lookup = "❌ FAILED — " + (e as Error).message;
    }
  }

  // 4. Try actual DB connection
  try {
    const { connectDB } = await import("@/lib/mongoose");
    await connectDB();
    results.mongodb_connection = "✅ connected";
  } catch (e: unknown) {
    results.mongodb_connection = "❌ FAILED";
    results.mongodb_error      = (e as Error).message;
  }

  return NextResponse.json(results, { status: 200 });
}