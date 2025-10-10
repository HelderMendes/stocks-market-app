import mongoose from 'mongoose';
import { config } from 'dotenv';

config({ path: '.env' });

async function testDatabaseConnection() {
  console.log('🔄 Testing database connection...\n');

  // Check if MONGODB_URI is set
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    console.log(
      'Please create a .env.local file with your MongoDB connection string.'
    );
    process.exit(1);
  }

  console.log('✅ MONGODB_URI found');
  console.log(
    '🔗 Connection string:',
    mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
  ); // Hide credentials

  try {
    // Test connection
    console.log('\n🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });

    console.log('✅ Successfully connected to MongoDB!');

    // Test database operations
    console.log('\n🔄 Testing basic database operations...');

    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    const dbStats = await admin.listDatabases();

    console.log('📊 Database info:');
    console.log('  - Database name:', db.databaseName);
    console.log('  - Connection state:', mongoose.connection.readyState);
    console.log(
      '  - Available databases:',
      dbStats.databases.map((d) => d.name).join(', ')
    );

    // Test a simple write/read operation
    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model('ConnectionTest', TestSchema);

    console.log('\n🔄 Testing write operation...');
    const testDoc = new TestModel({
      message: 'Database connection test successful!',
    });
    await testDoc.save();
    console.log('✅ Write operation successful!');

    console.log('🔄 Testing read operation...');
    const savedDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Read operation successful!');
    console.log('📄 Retrieved document:', {
      id: savedDoc._id,
      message: savedDoc.message,
      timestamp: savedDoc.timestamp,
    });

    // Clean up test document
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('🧹 Cleaned up test document');

    console.log('\n🎉 All database tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error details:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Possible solutions:');
      console.log('  - Make sure MongoDB is running');
      console.log('  - Check if your connection string is correct');
      console.log('  - Verify network connectivity');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Possible solutions:');
      console.log('  - Check your username and password');
      console.log('  - Verify user has proper database permissions');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n💡 Possible solutions:');
      console.log('  - Check your MongoDB hostname/URL');
      console.log('  - Verify internet connection');
    }

    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
