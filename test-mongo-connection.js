const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homegrow';

console.log('Starting MongoDB connection test...');
console.log('Connection string:', MONGODB_URI);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => {
  console.log('MongoDB connected successfully!');
  console.log('Connection details:');
  console.log('- Host:', mongoose.connection.host);
  console.log('- Database:', mongoose.connection.name);
  
  // Close connection
  return mongoose.connection.close();
})
.then(() => {
  console.log('MongoDB connection closed');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
