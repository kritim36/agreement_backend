import dns from 'dns';
import mongoose from 'mongoose';

// Some local routers drop/timeout large UDP TXT-record responses that
// mongodb+srv:// connection strings depend on (SRV lookups succeed, TXT
// lookups don't). Point this process at public resolvers to avoid that.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agreement-platform';
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected:', mongoose.connection.name);
  return mongoose.connection;
}

export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
