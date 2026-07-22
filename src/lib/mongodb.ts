// src/lib/mongodb.ts
import mongoose from 'mongoose';
import dns from 'dns'; 

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Silakan definisikan MONGODB_URI di dalam file .env');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };    
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4, 
      serverSelectionTimeoutMS: 5000, 
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;