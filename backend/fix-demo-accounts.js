/**
 * Fix Demo Accounts Script
 *
 * This script checks and fixes the demo account credentials in the database.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Enable more verbose logging
console.log('Starting fix-demo-accounts.js script...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set');

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');

    try {
      // Check if users collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const usersCollectionExists = collections.some(collection => collection.name === 'users');

      if (!usersCollectionExists) {
        console.log('Users collection does not exist. Creating it...');
        await mongoose.connection.db.createCollection('users');
      }

      // Check if admin user exists
      const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@homegrow.example' });

      if (adminUser) {
        console.log('Admin user exists. Updating password...');
        // Update admin password
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await mongoose.connection.db.collection('users').updateOne(
          { email: 'admin@homegrow.example' },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        );
        console.log('Admin password updated successfully');
      } else {
        console.log('Admin user does not exist. Creating it...');
        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await mongoose.connection.db.collection('users').insertOne({
          email: 'admin@homegrow.example',
          password: hashedPassword,
          name: 'Admin User',
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: ['admin', 'user'],
          preferences: {
            defaultCountry: 'usa',
            defaultClimate: 'temperate',
            defaultEnvironment: 'open',
            defaultArea: 10,
            preferredCrops: ['tomatoes', 'cucumbers', 'bellPeppers']
          }
        });
        console.log('Admin user created successfully');
      }

      // Check if regular user exists
      const regularUser = await mongoose.connection.db.collection('users').findOne({ email: 'user@homegrow.example' });

      if (regularUser) {
        console.log('Regular user exists. Updating password...');
        // Update regular user password
        const hashedPassword = await bcrypt.hash('password123', 10);
        await mongoose.connection.db.collection('users').updateOne(
          { email: 'user@homegrow.example' },
          {
            $set: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        );
        console.log('Regular user password updated successfully');
      } else {
        console.log('Regular user does not exist. Creating it...');
        // Create regular user
        const hashedPassword = await bcrypt.hash('password123', 10);
        await mongoose.connection.db.collection('users').insertOne({
          email: 'user@homegrow.example',
          password: hashedPassword,
          name: 'Regular User',
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: ['user'],
          preferences: {
            defaultCountry: 'usa',
            defaultClimate: 'temperate',
            defaultEnvironment: 'open',
            defaultArea: 5,
            preferredCrops: ['tomatoes', 'bellPeppers']
          }
        });
        console.log('Regular user created successfully');
      }

      console.log('Demo accounts fixed successfully!');
      console.log('\nDemo account credentials:');
      console.log('- Admin: admin@homegrow.example / admin123');
      console.log('- User: user@homegrow.example / password123');

    } catch (error) {
      console.error('Error fixing demo accounts:', error);
    } finally {
      // Close MongoDB connection
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
