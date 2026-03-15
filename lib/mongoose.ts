// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("🔍 [mongoose.ts] MONGODB_URI present:", !!MONGODB_URI);
console.log("🔍 [mongoose.ts] MONGODB_URI value:", MONGODB_URI?.slice(0, 40) + "...");

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

const cache = global as typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!cache._mongoose) cache._mongoose = { conn: null, promise: null };

export async function connectDB() {
  console.log("🔍 [connectDB] called — conn exists:", !!cache._mongoose!.conn);

  if (cache._mongoose!.conn) {
    console.log("✅ [connectDB] reusing existing connection");
    return cache._mongoose!.conn;
  }

  if (!cache._mongoose!.promise) {
    console.log("🔄 [connectDB] creating new connection to Atlas...");
    cache._mongoose!.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // fail fast after 10s
        connectTimeoutMS: 10000,
      })
      .then(m => {
        console.log("✅ [connectDB] connected to MongoDB Atlas successfully");
        return m;
      })
      .catch(err => {
        console.error("❌ [connectDB] connection FAILED:", err.message);
        // Reset so next request tries again
        cache._mongoose!.promise = null;
        throw err;
      });
  }

  try {
    cache._mongoose!.conn = await cache._mongoose!.promise;
  } catch (err) {
    throw err;
  }

  return cache._mongoose!.conn;
}