import dbConnect from './src/database/mongoose.ts';
import { config } from 'dotenv';

config({ path: '.env' });

async function testActualDbConnect() {
  console.log('🔄 Testing your actual dbConnect function...\n');

  try {
    console.log('🔄 Calling dbConnect()...');
    const mongoose = await dbConnect();

    console.log('✅ dbConnect() successful!');
    console.log('📊 Connection details:');
    console.log('  - Ready state:', mongoose.connection.readyState);
    console.log('  - Database name:', mongoose.connection.db.databaseName);
    console.log('  - Host:', mongoose.connection.host);

    // Test the caching mechanism
    console.log('\n🔄 Testing connection caching...');
    const mongoose2 = await dbConnect();

    if (mongoose === mongoose2) {
      console.log('✅ Connection caching is working correctly!');
    } else {
      console.log('⚠️  Warning: Connection caching may not be working');
    }

    console.log('\n🎉 Your dbConnect function is working perfectly!');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (error) {
    console.error('❌ Error testing dbConnect function:', error.message);
    process.exit(1);
  }
}

testActualDbConnect().catch(console.error);
