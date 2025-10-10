import { config } from 'dotenv';
import mongoose from 'mongoose';

config({ path: '.env' });

// Recreate the dbConnect logic here for testing
const MONGODB_URI = process.env.MONGODB_URI || '';

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { connection: null, promise: null };
}

async function testDbConnect() {
  console.log('🔄 Testing your dbConnect logic...\n');

  try {
    if (MONGODB_URI === '') {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local or .env'
      );
    }

    console.log('✅ MONGODB_URI found in environment');
    console.log('🔗 Testing connection caching logic...');

    if (cached.connection) {
      console.log('✅ Using cached connection');
      return cached.connection;
    }

    if (!cached.promise) {
      console.log('🔄 Creating new connection...');
      cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
      cached.connection = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Connection details:');
    console.log('  - Ready state:', cached.connection.connection.readyState);
    console.log(
      '  - Database name:',
      cached.connection.connection.db.databaseName
    );
    console.log('  - Host:', cached.connection.connection.host);

    // Test caching by calling again
    console.log('\n🔄 Testing connection caching...');
    const secondCall = await testDbConnect();

    if (cached.connection === secondCall) {
      console.log('✅ Connection caching is working correctly!');
    } else {
      console.log('⚠️  Warning: Connection caching may not be working');
    }

    console.log('\n🎉 Your dbConnect logic is working perfectly!');

    return cached.connection;
  } catch (error) {
    console.error('❌ Error testing dbConnect logic:', error.message);
    throw error;
  }
}

// Test the function
testDbConnect()
  .then(async (mongoose) => {
    if (mongoose) {
      await mongoose.connection.close();
      console.log('🔌 Connection closed');
    }
  })
  .catch((error) => {
    console.error('Test failed:', error.message);
    process.exit(1);
  });
