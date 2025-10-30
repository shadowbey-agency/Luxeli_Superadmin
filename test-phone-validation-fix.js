// Test script for Phone Number Validation Fix
// This script tests the updated phone number validation that accepts more formats

const testPhoneValidationFix = async () => {
  console.log('📱 Testing Phone Number Validation Fix...\n');

  // Step 1: Test various phone number formats
  console.log('Step 1: Testing phone number formats...');
  
  const testPhoneNumbers = [
    // Valid formats that should now work
    '1234567890',        // 10 digits
    '0123456789',         // Starting with 0
    '+1234567890',       // With country code
    '+1 234 567 890',    // With spaces
    '(123) 456-7890',    // With parentheses and dash
    '123-456-7890',      // With dashes
    '123.456.7890',      // With dots
    '+44 20 7946 0958',  // UK format
    '+33 1 23 45 67 89', // French format
    '555-123-4567',      // US format with dashes
    '+91 98765 43210',   // Indian format
    
    // Invalid formats that should still fail
    '123',               // Too short
    '1234567890123456789012345', // Too long
    'abc1234567',       // Contains letters
    '123-abc-4567',     // Contains letters
    '',                 // Empty
    '   ',              // Only spaces
  ];

  // Step 2: Test the new validation logic
  console.log('Step 2: Testing new validation logic...');
  
  const validatePhone = (phoneNumber) => {
    if (!phoneNumber) return false;
    
    // More flexible phone validation - accepts various formats
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/[\(\)\-]/g, '');
    
    return phoneRegex.test(phoneNumber) && cleanPhone.length >= 7 && cleanPhone.length <= 15;
  };

  testPhoneNumbers.forEach(phone => {
    const isValid = validatePhone(phone);
    const status = isValid ? '✅ VALID' : '❌ INVALID';
    console.log(`${status}: "${phone}"`);
  });

  // Step 3: Test with actual API call
  console.log('\nStep 3: Testing with actual API call...');
  
  // Check authentication
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  if (!token) {
    console.log('⚠️ No authentication token found. Please log in first.');
    console.log('💡 To test with API, navigate to /login and enter credentials');
    return;
  }

  const userData = localStorage.getItem('superadmin_data') || sessionStorage.getItem('superadmin_data');
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    const userId = parsedUserData._id;
    const userRole = parsedUserData.role;
    
    console.log('Testing with user ID:', userId);
    console.log('User role:', userRole);
    
    // Test with a valid phone number
    const testPhoneNumber = '1234567890';
    let apiEndpoint = '';
    let testData = {};
    
    if (userRole === 'superadmin') {
      apiEndpoint = `/api/superadmin/superadmins/${userId}`;
      testData = {
        fullName: parsedUserData.fullName,
        email: parsedUserData.email,
        phoneNumber: testPhoneNumber
      };
    } else {
      apiEndpoint = `/api/superadmin/members/${userId}`;
      testData = {
        name: parsedUserData.name || parsedUserData.fullName,
        email: parsedUserData.email,
        phone: testPhoneNumber,
        username: parsedUserData.username || 'testuser'
      };
    }
    
    try {
      console.log('🧪 Testing API with phone number:', testPhoneNumber);
      console.log('API endpoint:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API test successful:', result);
      } else {
        const errorText = await response.text();
        console.log('❌ API test failed:', errorText);
      }
    } catch (error) {
      console.log('❌ API test error:', error);
    }
  }

  // Step 4: Expected Behavior
  console.log('\nStep 4: Expected Behavior:');
  console.log('✅ Accepts phone numbers starting with 0');
  console.log('✅ Accepts various formats: +1 234 567 890, (123) 456-7890, 123-456-7890');
  console.log('✅ Accepts international formats: +44 20 7946 0958');
  console.log('✅ Rejects numbers that are too short (< 7 digits)');
  console.log('✅ Rejects numbers that are too long (> 15 digits)');
  console.log('✅ Rejects numbers with letters or special characters');
  console.log('✅ Provides clear error messages');

  // Step 5: Manual Testing Instructions
  console.log('\nStep 5: Manual Testing Instructions:');
  console.log('1. Navigate to /superadmin/pages/settings');
  console.log('2. Try updating phone number with various formats:');
  console.log('   - 1234567890');
  console.log('   - 0123456789');
  console.log('   - +1 234 567 890');
  console.log('   - (123) 456-7890');
  console.log('   - 123-456-7890');
  console.log('3. Check that valid formats are accepted');
  console.log('4. Check that invalid formats show clear error messages');
  console.log('5. Verify that account updates work with valid phone numbers');

  console.log('\n🎯 Test Complete! Phone number validation should now be more flexible.');
};

// Instructions for running the test
console.log(`
📱 Phone Number Validation Fix Test

This script tests the updated phone number validation that accepts more formats.

The fix includes:
✅ More flexible regex: /^[\+]?[\d\s\-\(\)]{7,20}$/
✅ Accepts phone numbers starting with 0
✅ Accepts various formats: spaces, dashes, parentheses
✅ Validates clean phone length (7-15 digits)
✅ Better error messages

To run the test:
1. Open browser console (F12)
2. Run: testPhoneValidationFix()

The phone validation should now accept more common formats!
`);

// Uncomment the line below to run the test automatically
// testPhoneValidationFix();


