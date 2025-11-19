import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import SuperAdmin from './models/SuperAdmin';
import { hashPassword } from './lib/auth';

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await SuperAdmin.findOne({ email: 'admin@luxeli.com' });
    if (existingAdmin) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await hashPassword('Admin123!');

    // Create super admin
    const superAdmin = new SuperAdmin({
      fullName: 'Luxeli Super Admin',
      email: 'admin@luxeli.com',
      phoneNumber: '+1234567890',
      password: hashedPassword,
      role: 'superadmin'
    });

    await superAdmin.save();
    console.log('Super admin created successfully');
    console.log('Email: admin@luxeli.com');
    console.log('Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
}

createSuperAdmin();