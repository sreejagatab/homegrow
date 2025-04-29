const mongoose = require('mongoose');

console.log('Starting simple MongoDB connection test...');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/homegrow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
