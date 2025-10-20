// Simple test to run in your Next.js app
import dbConnection from '@/database/mongoose';

export default async function TestDB() {
  let connectionStatus = 'Not tested';
  let error = null;

  try {
    console.log('Testing database connection...');
    await dbConnection();
    connectionStatus = 'Connected successfully!';
    console.log('Database connection successful!');
  } catch (err) {
    connectionStatus = 'Connection failed';
    error = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Database connection failed:', err);
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Database Connection Test</h1>

      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <h2 className="mb-2 font-semibold">Connection Status:</h2>
        <p
          className={`font-mono ${connectionStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
        >
          {connectionStatus}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-semibold text-red-800">Error Details:</h2>
          <p className="font-mono text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h2 className="mb-2 font-semibold text-blue-800">Environment Check:</h2>
        <p className="text-blue-700">
          MONGODB_URI is {process.env.MONGODB_URI ? 'set' : 'not set'}
        </p>
        {process.env.MONGODB_URI && (
          <p className="mt-2 font-mono text-xs text-blue-700">
            {process.env.MONGODB_URI.replace(
              /\/\/([^:]+):([^@]+)@/,
              '//***:***@'
            )}
          </p>
        )}
      </div>
    </div>
  );
}
