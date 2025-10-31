// Database Migration Script for Partner Email Field
// This script helps migrate old 'email' field to 'hotelAddressEmail'

const mongoose = require('mongoose');

// Define the old schema (with email field)
const oldPartnerSchema = new mongoose.Schema({
  hotelName: String,
  hotelCity: String,
  email: String, // Old field
  hotelAddressEmail: String, // New field
  phoneNumber: String,
  RC: String,
  ICE: String,
  identifiantFiscal: String,
  taxeProfessionnelle: String,
  hotelImage: String,
  username: String,
  password: String,
  startDate: Date,
  endDate: Date,
  plan: String,
  services: [String],
  isActive: Boolean, // Old field
  status: String, // New field
  createdAt: Date,
  updatedAt: Date
}, { collection: 'partners' });

const Partner = mongoose.model('Partner', oldPartnerSchema);

async function migratePartnerData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('🔍 Connected to database');
    
    // Check for partners with old 'email' field
    const partnersWithOldEmail = await Partner.find({ 
      email: { $exists: true },
      hotelAddressEmail: { $exists: false }
    });
    
    console.log(`\n📊 Found ${partnersWithOldEmail.length} partners with old 'email' field:`);
    
    if (partnersWithOldEmail.length > 0) {
      console.log('\n🔧 Migrating partners with old email field...');
      
      for (const partner of partnersWithOldEmail) {
        console.log(`\nMigrating partner: ${partner.hotelName}`);
        console.log(`  Old email: ${partner.email}`);
        
        // Copy email to hotelAddressEmail
        await Partner.updateOne(
          { _id: partner._id },
          { 
            $set: { 
              hotelAddressEmail: partner.email,
              status: partner.isActive ? 'active' : 'disable'
            },
            $unset: { email: 1, isActive: 1 }
          }
        );
        
        console.log(`  ✅ Migrated to hotelAddressEmail: ${partner.email}`);
        console.log(`  ✅ Migrated status: ${partner.isActive ? 'active' : 'disable'}`);
      }
      
      console.log('\n✅ Migration completed!');
    } else {
      console.log('✅ No partners with old email field found');
    }
    
    // Check for partners with old 'isActive' field
    const partnersWithOldStatus = await Partner.find({ 
      isActive: { $exists: true },
      status: { $exists: false }
    });
    
    console.log(`\n📊 Found ${partnersWithOldStatus.length} partners with old 'isActive' field:`);
    
    if (partnersWithOldStatus.length > 0) {
      console.log('\n🔧 Migrating partners with old isActive field...');
      
      for (const partner of partnersWithOldStatus) {
        console.log(`\nMigrating partner: ${partner.hotelName}`);
        console.log(`  Old isActive: ${partner.isActive}`);
        
        // Convert isActive to status
        await Partner.updateOne(
          { _id: partner._id },
          { 
            $set: { status: partner.isActive ? 'active' : 'disable' },
            $unset: { isActive: 1 }
          }
        );
        
        console.log(`  ✅ Migrated status: ${partner.isActive ? 'active' : 'disable'}`);
      }
      
      console.log('\n✅ Status migration completed!');
    } else {
      console.log('✅ No partners with old isActive field found');
    }
    
    // Final check - show all partners
    const allPartners = await Partner.find({}, { 
      hotelName: 1, 
      hotelAddressEmail: 1, 
      username: 1, 
      status: 1,
      email: 1,
      isActive: 1
    });
    
    console.log('\n📊 Final partner data:');
    allPartners.forEach((partner, index) => {
      console.log(`${index + 1}. ${partner.hotelName}`);
      console.log(`   Email: ${partner.hotelAddressEmail || partner.email || 'MISSING'}`);
      console.log(`   Username: ${partner.username}`);
      console.log(`   Status: ${partner.status || partner.isActive || 'MISSING'}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    console.log('✅ Database migration complete!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
  }
}

// Instructions
console.log(`
🔧 Partner Database Migration Script

This script migrates old partner data from 'email' to 'hotelAddressEmail' and 'isActive' to 'status'.

Issues Fixed:
- Old 'email' field → 'hotelAddressEmail' field
- Old 'isActive' field → 'status' field
- Schema mismatch causing duplicate errors

Run this script to fix the database schema issues.

Usage:
node migrate-partner-data.js
`);

// Uncomment to run migration
// migratePartnerData();



