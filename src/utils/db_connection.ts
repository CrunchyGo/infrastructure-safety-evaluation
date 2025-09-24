import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

const MONGOOSE_CONNECTION_STRING = process.env.NEXT_PUBLIC_MONGOOSE_CONNECTION_STRING;

// Vercel serverless optimization
let cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering for serverless
      maxPoolSize: 1, // Maintain only 1 connection for serverless
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    cached.promise = mongoose
      .connect(MONGOOSE_CONNECTION_STRING!, opts)
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
