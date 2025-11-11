// MongoDB Email Field Cleanup Script
// This script completely removes the email field from the partners collection

const mongoose = require('mongoose');

async function dropEmailFieldFromPartners() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('🔍 Connected to database');
    
    const db = mongoose.connection.db;
    const partnersCollection = db.collection('partners');
    
    console.log('\n📊 Current partners collection structure:');
    
    // Check current indexes
    console.log('\n🔍 Current indexes:');
    const indexes = await partnersCollection.indexes();
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Check for email field in documents
    console.log('\n🔍 Checking for email field in documents:');
    const partnersWithEmail = await partnersCollection.find({ email: { $exists: true } }).toArray();
    console.log(`Found ${partnersWithEmail.length} partners with email field`);
    
    if (partnersWithEmail.length > 0) {
      console.log('\n📋 Partners with email field:');
      partnersWithEmail.forEach((partner, i) => {
        console.log(`${i + 1}. ${partner.hotelName || 'Unknown'}:`);
        console.log(`   Email: ${partner.email}`);
        console.log(`   HotelAddressEmail: ${partner.hotelAddressEmail || 'Not set'}`);
      });
    }
    
    // Step 1: Drop email field indexes
    console.log('\n🔧 Step 1: Dropping email field indexes...');
    
    const emailIndexes = indexes.filter(index => 
      index.key && index.key.email !== undefined
    );
    
    if (emailIndexes.length > 0) {
      for (const index of emailIndexes) {
        try {
          console.log(`   Dropping index: ${index.name}`);
          await partnersCollection.dropIndex(index.name);
          console.log(`   ✅ Successfully dropped index: ${index.name}`);
        } catch (dropError) {
          console.log(`   ⚠️ Could not drop index ${index.name}: ${dropError.message}`);
        }
      }
    } else {
      console.log('   ✅ No email field indexes found');
    }
    
    // Step 2: Remove email field from all documents
    console.log('\n🔧 Step 2: Removing email field from all documents...');
    
    if (partnersWithEmail.length > 0) {
      const result = await partnersCollection.updateMany(
        { email: { $exists: true } },
        { $unset: { email: 1 } }
      );
      
      console.log(`   ✅ Removed email field from ${result.modifiedCount} documents`);
    } else {
      console.log('   ✅ No documents with email field found');
    }
    
    // Step 3: Verify cleanup
    console.log('\n🔧 Step 3: Verifying cleanup...');
    
    const remainingEmailDocs = await partnersCollection.find({ email: { $exists: true } }).toArray();
    console.log(`   Remaining documents with email field: ${remainingEmailDocs.length}`);
    
    const finalIndexes = await partnersCollection.indexes();
    const remainingEmailIndexes = finalIndexes.filter(index => 
      index.key && index.key.email !== undefined
    );
    console.log(`   Remaining email field indexes: ${remainingEmailIndexes.length}`);
    
    // Step 4: Show final structure
    console.log('\n📊 Final collection structure:');
    
    console.log('\n🔍 Final indexes:');
    finalIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n🔍 Sample document structure:');
    const sampleDoc = await partnersCollection.findOne({});
    if (sampleDoc) {
      console.log('   Fields:', Object.keys(sampleDoc));
      console.log('   HotelAddressEmail:', sampleDoc.hotelAddressEmail || 'Not set');
      console.log('   Email field exists:', sampleDoc.email !== undefined ? 'YES' : 'NO');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Email field cleanup complete!');
    console.log('The email field and its indexes have been completely removed from the partners collection.');
    
  } catch (error) {
    console.error('❌ Error during email field cleanup:', error.message);
  }
}

// Instructions
console.log(`
🔧 MongoDB Email Field Cleanup Script

This script completely removes the email field from the partners collection.

What this script does:
1. Connects to MongoDB
2. Lists current indexes and documents with email field
3. Drops all email field indexes
4. Removes email field from all documents
5. Verifies cleanup is complete
6. Shows final collection structure

This will permanently resolve the "Duplicate entry found for email: null" error.

Usage:
node drop-email-field.js
`);

// Uncomment to run cleanup
// dropEmailFieldFromPartners();














