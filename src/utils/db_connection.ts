import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect("mongodb+srv://crunchygo7_db_user:AzQ48iQlzzADm7O3@cluster0.vdqqili.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
