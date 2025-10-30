// Debug script for Partner Duplicate Entry Error
// This script helps debug the specific duplicate entry error with the provided data

const debugPartnerDuplicateError = () => {
  console.log('🔧 Debugging Partner Duplicate Entry Error...\n');

  // Provided Data Analysis
  console.log('Provided Data Analysis:');
  console.log('');
  console.log('📊 New Partner Data:');
  console.log('```json');
  console.log('{');
  console.log('  "hotelName": "Grand Hotel",');
  console.log('  "hotelCity": "Casablanca",');
  console.log('  "hotelAddress": "123 Main Street",');
  console.log('  "hotelAddressEmail": "hotel@example.com",');
  console.log('  "phoneNumber": "+212123456789",');
  console.log('  "RC": "RC123456",');
  console.log('  "ICE": "ICE123456789",');
  console.log('  "identifiantFiscal": "IF123456789",');
  console.log('  "taxeProfessionnelle": "TP123456789",');
  console.log('  "username": "grandhotel",');
  console.log('  "password": "password123",');
  console.log('  "startDate": "2023-09-01",');
  console.log('  "endDate": "2024-09-01",');
  console.log('  "plan": "premium",');
  console.log('  "services": ["room-service", "spa"]');
  console.log('}');
  console.log('```');
  console.log('');

  console.log('📊 Existing Partner Data:');
  console.log('```json');
  console.log('{');
  console.log('  "hotelName": "hashmi",');
  console.log('  "hotelCity": "Marrakech",');
  console.log('  "hotelAddressEmail": "zubairhashmi423@gmail.com",');
  console.log('  "phoneNumber": "03253708621",');
  console.log('  "RC": "234swe234",');
  console.log('  "ICE": "234wer",');
  console.log('  "identifiantFiscal": "qwe23",');
  console.log('  "taxeProfessionnelle": "234wer",');
  console.log('  "username": "zubair",');
  console.log('  "password": "$2a$12$jT/bhddIrvvKD0SYyvMeuepS27Hy00DItICiCgiNq49rRCrDddVLW",');
  console.log('  "startDate": "2025-10-01T00:00:00.000+00:00",');
  console.log('  "endDate": "2025-10-21T00:00:00.000+00:00",');
  console.log('  "plan": "premium",');
  console.log('  "services": [],');
  console.log('  "isActive": true,');
  console.log('  "createdAt": "2025-10-28T18:59:19.887+00:00",');
  console.log('  "updatedAt": "2025-10-28T18:59:19.887+00:00"');
  console.log('}');
  console.log('```');
  console.log('');

  // Potential Issues
  console.log('Potential Issues Identified:');
  console.log('');
  console.log('❌ Issue 1: Email Conflict');
  console.log('   - New: "hotel@example.com"');
  console.log('   - Existing: "zubairhashmi423@gmail.com"');
  console.log('   - Status: ✅ No conflict (different emails)');
  console.log('');
  console.log('❌ Issue 2: Username Conflict');
  console.log('   - New: "grandhotel"');
  console.log('   - Existing: "zubair"');
  console.log('   - Status: ✅ No conflict (different usernames)');
  console.log('');
  console.log('❌ Issue 3: Schema Mismatch');
  console.log('   - Old partner has: "isActive": true');
  console.log('   - New schema expects: "status": "active"');
  console.log('   - Status: ⚠️ Potential issue');
  console.log('');
  console.log('❌ Issue 4: Hidden Duplicates');
  console.log('   - There might be other partners in database');
  console.log('   - Mock data might have conflicts');
  console.log('   - Case sensitivity issues');
  console.log('');

  // Debugging Steps
  console.log('Debugging Steps:');
  console.log('');
  console.log('1. 🔍 Check Database for Existing Partners:');
  console.log('```javascript');
  console.log('// Check all partners');
  console.log('db.partners.find({}, { hotelAddressEmail: 1, username: 1, hotelName: 1 })');
  console.log('');
  console.log('// Check for specific email');
  console.log('db.partners.findOne({ hotelAddressEmail: "hotel@example.com" })');
  console.log('');
  console.log('// Check for specific username');
  console.log('db.partners.findOne({ username: "grandhotel" })');
  console.log('');
  console.log('// Check for case-insensitive matches');
  console.log('db.partners.findOne({ hotelAddressEmail: { $regex: /^hotel@example\\.com$/i } })');
  console.log('```');
  console.log('');

  console.log('2. 🔍 Check Mock Data Conflicts:');
  console.log('   - Look for "Hotel@email.com" in mock data');
  console.log('   - Check if mock data was accidentally saved to database');
  console.log('   - Verify case sensitivity');
  console.log('');

  console.log('3. 🔍 Check Schema Issues:');
  console.log('   - Old partners might have "isActive" field');
  console.log('   - New partners should have "status" field');
  console.log('   - Check if validation is looking at wrong field');
  console.log('');

  // Test Solutions
  console.log('Test Solutions:');
  console.log('');
  console.log('✅ Solution 1: Use Completely Unique Data');
  console.log('```json');
  console.log('{');
  console.log('  "hotelName": "Test Hotel ' + Date.now() + '",');
  console.log('  "hotelCity": "Test City",');
  console.log('  "hotelAddressEmail": "test' + Date.now() + '@example.com",');
  console.log('  "username": "testuser' + Date.now() + '",');
  console.log('  "phoneNumber": "+212123456789",');
  console.log('  "RC": "RC' + Date.now() + '",');
  console.log('  "ICE": "ICE' + Date.now() + '",');
  console.log('  "identifiantFiscal": "IF' + Date.now() + '",');
  console.log('  "taxeProfessionnelle": "TP' + Date.now() + '",');
  console.log('  "password": "password123",');
  console.log('  "startDate": "2023-09-01",');
  console.log('  "endDate": "2024-09-01",');
  console.log('  "plan": "premium",');
  console.log('  "services": ["room-service", "spa"]');
  console.log('}');
  console.log('```');
  console.log('');

  console.log('✅ Solution 2: Check Database Cleanup');
  console.log('```javascript');
  console.log('// Remove test partners');
  console.log('db.partners.deleteMany({ hotelAddressEmail: { $regex: /test.*@example\\.com/ } })');
  console.log('');
  console.log('// Remove mock data partners');
  console.log('db.partners.deleteMany({ hotelAddressEmail: "Hotel@email.com" })');
  console.log('');
  console.log('// Check remaining partners');
  console.log('db.partners.find({}, { hotelAddressEmail: 1, username: 1 })');
  console.log('```');
  console.log('');

  console.log('✅ Solution 3: Check Case Sensitivity');
  console.log('   - Try: "Hotel@example.com" (capital H)');
  console.log('   - Try: "GRANDHOTEL" (all caps)');
  console.log('   - Check if validation is case-sensitive');
  console.log('');

  // API Testing
  console.log('API Testing:');
  console.log('');
  console.log('🔍 Test API Endpoint Directly:');
  console.log('```bash');
  console.log('curl -X POST http://localhost:3000/api/superadmin/partners \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_TOKEN" \\');
  console.log('  -d \'{');
  console.log('    "hotelName": "Test Hotel",');
  console.log('    "hotelCity": "Test City",');
  console.log('    "hotelAddressEmail": "test@example.com",');
  console.log('    "username": "testuser",');
  console.log('    "phoneNumber": "+212123456789",');
  console.log('    "RC": "RC123456",');
  console.log('    "ICE": "ICE123456789",');
  console.log('    "identifiantFiscal": "IF123456789",');
  console.log('    "taxeProfessionnelle": "TP123456789",');
  console.log('    "password": "password123",');
  console.log('    "startDate": "2023-09-01",');
  console.log('    "endDate": "2024-09-01",');
  console.log('    "plan": "premium",');
  console.log('    "services": ["room-service", "spa"]');
  console.log('  }\'');
  console.log('```');
  console.log('');

  // Console Debugging
  console.log('Console Debugging:');
  console.log('');
  console.log('🔍 Check Browser Console:');
  console.log('   - Look for "Form data before sending:" log');
  console.log('   - Check "Email being sent:" and "Username being sent:" logs');
  console.log('   - Look for API response logs');
  console.log('   - Check for any JavaScript errors');
  console.log('');

  console.log('🔍 Check Network Tab:');
  console.log('   - Look for POST request to /api/superadmin/partners');
  console.log('   - Check request payload');
  console.log('   - Check response status and body');
  console.log('   - Look for 409 status code');
  console.log('');

  // Common Causes
  console.log('Common Causes:');
  console.log('');
  console.log('⚠️ Mock Data in Database:');
  console.log('   - Mock data might have been saved to database');
  console.log('   - Check for "Hotel@email.com" entries');
  console.log('   - Check for "hotel_user1", "hotel_user2" usernames');
  console.log('');
  console.log('⚠️ Previous Test Data:');
  console.log('   - Previous test runs might have created partners');
  console.log('   - Check for "test@example.com" entries');
  console.log('   - Check for "testuser" usernames');
  console.log('');
  console.log('⚠️ Case Sensitivity:');
  console.log('   - "hotel@example.com" vs "Hotel@example.com"');
  console.log('   - "grandhotel" vs "GrandHotel"');
  console.log('   - Check if validation is case-sensitive');
  console.log('');

  console.log('🎯 Next Steps:');
  console.log('1. Check database for existing partners');
  console.log('2. Use completely unique data for testing');
  console.log('3. Check browser console for detailed logs');
  console.log('4. Test API endpoint directly');
  console.log('5. Clean up any test/mock data');
  console.log('');

  console.log('The duplicate entry error should be resolved with unique data!');
};

// Instructions for debugging
console.log(`
🔧 Partner Duplicate Entry Error Debug

This script helps debug the specific duplicate entry error.

Analysis:
- New partner data looks unique
- Existing partner data is different
- Potential hidden duplicates in database

Debugging Steps:
1. Check database for existing partners
2. Use completely unique data
3. Check browser console logs
4. Test API endpoint directly
5. Clean up test data

The issue is likely hidden duplicates in the database!
`);

// Uncomment to run the debug guide
// debugPartnerDuplicateError();

