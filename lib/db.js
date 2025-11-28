// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = 'mongodb+srv://ecommerceUser:admin2025@cluster0.3govpl5.mongodb.net/?appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI env variable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose)
      .catch(err => {
          console.error("MONGODB CONNECT ERROR →", err);
          throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
