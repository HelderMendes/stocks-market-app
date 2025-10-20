import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

declare global {
  var mongooseCache: {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { connection: null, promise: null };
}

async function dbConnection() {
  if (MONGODB_URI === '')
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local or .env'
    );

  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  console.log(
    'MongoDB is connected ' + process.env.NODE_ENV + ' - ' + MONGODB_URI
  );
  return cached.connection;
}

export default dbConnection;
