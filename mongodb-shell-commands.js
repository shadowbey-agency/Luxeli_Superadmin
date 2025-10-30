// MongoDB Shell Commands to Drop Email Field
// Run these commands directly in MongoDB shell or MongoDB Compass

console.log(`
🔧 MongoDB Shell Commands to Drop Email Field

Run these commands in MongoDB shell or MongoDB Compass:

// 1. Connect to your database
use luxeli

// 2. Check current indexes on partners collection
db.partners.getIndexes()

// 3. Check documents with email field
db.partners.find({ email: { $exists: true } }, { hotelName: 1, email: 1, hotelAddressEmail: 1 })

// 4. Drop email field indexes (run each command separately)
db.partners.dropIndex({ email: 1 })
db.partners.dropIndex({ email: 1, _id: 1 })  // If compound index exists

// 5. Remove email field from all documents
db.partners.updateMany(
  { email: { $exists: true } },
  { $unset: { email: 1 } }
)

// 6. Verify cleanup
db.partners.find({ email: { $exists: true } }).count()
db.partners.getIndexes()

// 7. Check final structure
db.partners.findOne({}, { hotelName: 1, hotelAddressEmail: 1 })

Alternative single command to remove email field:
db.partners.updateMany({}, { $unset: { email: 1 } })

To drop all indexes except _id_:
db.partners.dropIndexes()

To recreate only necessary indexes:
db.partners.createIndex({ hotelAddressEmail: 1 })
db.partners.createIndex({ username: 1 })
db.partners.createIndex({ hotelCity: 1 })
db.partners.createIndex({ plan: 1 })
db.partners.createIndex({ status: 1 })
`);

// Also create a simple Node.js script for direct execution
const mongoose = require('mongoose');

async function quickEmailFieldDrop() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('🔍 Connected to database');
    
    const db = mongoose.connection.db;
    const partnersCollection = db.collection('partners');
    
    console.log('\n🔧 Quick email field removal...');
    
    // Remove email field from all documents
    const result = await partnersCollection.updateMany(
      {},
      { $unset: { email: 1 } }
    );
    
    console.log(`✅ Removed email field from ${result.modifiedCount} documents`);
    
    // Drop email indexes
    try {
      await partnersCollection.dropIndex({ email: 1 });
      console.log('✅ Dropped email field index');
    } catch (error) {
      console.log('⚠️ Email index may not exist:', error.message);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Quick cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Uncomment to run quick cleanup
// quickEmailFieldDrop();


