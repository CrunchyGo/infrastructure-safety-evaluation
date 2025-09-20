import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const MONGOOSE_CONNECTION_STRING = process.env.NEXT_PUBLIC_MONGOOSE_CONNECTION_STRING;

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGOOSE_CONNECTION_STRING!)
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
