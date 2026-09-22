const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes('localhost')) {
    try {
      console.log('📡 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(mongoUri, {
        dbName: 'foodRescueDB',
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`⚠️ MongoDB Atlas Connection Failed: ${error.message}`);
      console.log('👉 Please check your MONGO_URI in backend/.env and ensure your IP is whitelisted on MongoDB Atlas.');
    }
  }

  // Fallback to in-memory MongoDB Server for instant local testing/development
  try {
    console.log('🔄 Launching in-memory MongoDB database...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, { dbName: 'foodRescueDB' });
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('💡 Note: Provide your actual Atlas connection string in MONGO_URI in backend/.env for production storage.');
    return true;
  } catch (err) {
    console.error('❌ In-Memory MongoDB failed to start:', err.message);
    return false;
  }
};

module.exports = connectDB;
