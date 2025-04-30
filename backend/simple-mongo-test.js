require('dotenv').config();
const mongoose = require('mongoose');

console.log('Starting simple MongoDB connection test...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
