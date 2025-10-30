// Simple Database Check Script
// This script checks for old email fields in the database

const mongoose = require('mongoose');

// Simple schema for checking
const partnerSchema = new mongoose.Schema({}, { collection: 'partners', strict: false });
const Partner = mongoose.model('Partner', partnerSchema);

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxeli');
    console.log('🔍 Connected to database');
    
    // Check all partners
    const allPartners = await Partner.find({});
    console.log(`\n📊 Found ${allPartners.length} partners in database:`);
    
    allPartners.forEach((partner, index) => {
      console.log(`\n${index + 1}. Partner: ${partner.hotelName || 'Unknown'}`);
      console.log(`   Email field: ${partner.email || 'NOT FOUND'}`);
      console.log(`   HotelAddressEmail field: ${partner.hotelAddressEmail || 'NOT FOUND'}`);
      console.log(`   Username: ${partner.username || 'NOT FOUND'}`);
      console.log(`   isActive field: ${partner.isActive !== undefined ? partner.isActive : 'NOT FOUND'}`);
      console.log(`   status field: ${partner.status || 'NOT FOUND'}`);
    });
    
    // Check for specific conflicts
    console.log('\n🔍 Checking for specific conflicts:');
    
    // Check old email field
    const oldEmailPartners = await Partner.find({ email: { $exists: true } });
    console.log(`\n📧 Partners with old 'email' field: ${oldEmailPartners.length}`);
    oldEmailPartners.forEach(partner => {
      console.log(`   - ${partner.hotelName}: ${partner.email}`);
    });
    
    // Check new email field
    const newEmailPartners = await Partner.find({ hotelAddressEmail: { $exists: true } });
    console.log(`\n📧 Partners with new 'hotelAddressEmail' field: ${newEmailPartners.length}`);
    newEmailPartners.forEach(partner => {
      console.log(`   - ${partner.hotelName}: ${partner.hotelAddressEmail}`);
    });
    
    // Check for conflicts with your test data
    const emailConflict = await Partner.findOne({ 
      $or: [
        { email: 'hotel@example.com' },
        { hotelAddressEmail: 'hotel@example.com' }
      ]
    });
    
    if (emailConflict) {
      console.log('\n❌ Email conflict found for "hotel@example.com":');
      console.log(`   Partner: ${emailConflict.hotelName}`);
      console.log(`   Old email: ${emailConflict.email}`);
      console.log(`   New email: ${emailConflict.hotelAddressEmail}`);
    } else {
      console.log('\n✅ No email conflict for "hotel@example.com"');
    }
    
    const usernameConflict = await Partner.findOne({ username: 'grandhotel' });
    if (usernameConflict) {
      console.log('\n❌ Username conflict found for "grandhotel":');
      console.log(`   Partner: ${usernameConflict.hotelName}`);
      console.log(`   Email: ${usernameConflict.email || usernameConflict.hotelAddressEmail}`);
    } else {
      console.log('\n✅ No username conflict for "grandhotel"');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.log('\n💡 Make sure MongoDB is running and accessible');
  }
}

checkDatabase();

