// Database Index Cleanup Script
// This script removes old email field indexes that are causing conflicts

const mongoose = require('mongoose');

async function cleanupDatabaseIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('🔍 Connected to database');
    
    const db = mongoose.connection.db;
    
    // Check current indexes on partners collection
    console.log('\n📊 Current indexes on partners collection:');
    const partnerIndexes = await db.collection('partners').indexes();
    partnerIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for old email field index
    const emailIndex = partnerIndexes.find(index => 
      index.key && index.key.email !== undefined
    );
    
    if (emailIndex) {
      console.log('\n❌ Found old email field index:', emailIndex.name);
      console.log('🔧 Removing old email field index...');
      
      try {
        await db.collection('partners').dropIndex(emailIndex.name);
        console.log('✅ Successfully removed old email field index');
      } catch (dropError) {
        console.log('⚠️ Could not drop index:', dropError.message);
        console.log('💡 This might be because the index is already removed or has a different name');
      }
    } else {
      console.log('\n✅ No old email field index found');
    }
    
    // Check current indexes on members collection
    console.log('\n📊 Current indexes on members collection:');
    const memberIndexes = await db.collection('members').indexes();
    memberIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for old email field index in members
    const memberEmailIndex = memberIndexes.find(index => 
      index.key && index.key.email !== undefined
    );
    
    if (memberEmailIndex) {
      console.log('\n❌ Found old email field index in members:', memberEmailIndex.name);
      console.log('🔧 Removing old email field index from members...');
      
      try {
        await db.collection('members').dropIndex(memberEmailIndex.name);
        console.log('✅ Successfully removed old email field index from members');
      } catch (dropError) {
        console.log('⚠️ Could not drop index:', dropError.message);
      }
    } else {
      console.log('\n✅ No old email field index found in members');
    }
    
    // Show final indexes
    console.log('\n📊 Final indexes on partners collection:');
    const finalPartnerIndexes = await db.collection('partners').indexes();
    finalPartnerIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n📊 Final indexes on members collection:');
    const finalMemberIndexes = await db.collection('members').indexes();
    finalMemberIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Database index cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during index cleanup:', error.message);
  }
}

// Instructions
console.log(`
🔧 Database Index Cleanup Script

This script removes old email field indexes that are causing "Duplicate entry found for email: null" errors.

Issue: Old database indexes still reference the 'email' field, but new schema uses 'hotelAddressEmail'

What this script does:
1. Connects to MongoDB
2. Lists current indexes on partners and members collections
3. Finds and removes old 'email' field indexes
4. Shows final index structure

Run this script to fix the index conflicts.

Usage:
node cleanup-database-indexes.js
`);

// Run cleanup
cleanupDatabaseIndexes();

