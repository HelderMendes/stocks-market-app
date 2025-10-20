import dbConnection from './src/database/mongoose.ts';
import { config } from 'dotenv';

config({ path: '.env' });

async function testActualdbConnection() {
  console.log('🔄 Testing your actual dbConnection function...\n');

  try {
    console.log('🔄 Calling dbConnection()...');
    const mongoose = await dbConnection();

    console.log('✅ dbConnection() successful!');
    console.log('📊 Connection details:');
    console.log('  - Ready state:', mongoose.connection.readyState);
    console.log('  - Database name:', mongoose.connection.db.databaseName);
    console.log('  - Host:', mongoose.connection.host);

    // Test the caching mechanism
    console.log('\n🔄 Testing connection caching...');
    const mongoose2 = await dbConnection();

    if (mongoose === mongoose2) {
      console.log('✅ Connection caching is working correctly!');
    } else {
      console.log('⚠️  Warning: Connection caching may not be working');
    }

    console.log('\n🎉 Your dbConnection function is working perfectly!');

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (error) {
    console.error('❌ Error testing dbConnection function:', error.message);
    process.exit(1);
  }
}

testActualdbConnection().catch(console.error);
