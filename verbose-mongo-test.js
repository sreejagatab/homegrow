const mongoose = require('mongoose');

console.log('Starting verbose MongoDB connection test...');
console.log('Mongoose version:', mongoose.version);

// Enable mongoose debug mode
mongoose.set('debug', true);

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb://localhost:27017/homegrow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully!');
  console.log('Connection details:');
  console.log('- Host:', mongoose.connection.host);
  console.log('- Database:', mongoose.connection.name);
  console.log('- Ready state:', mongoose.connection.readyState);
  
  // Close connection
  console.log('Closing connection...');
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
