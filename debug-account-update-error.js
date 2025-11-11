// Debug script for Account Update Error
// This script helps identify why "Failed to update account" error occurs

const debugAccountUpdateError = async () => {
  console.log('🐛 Debugging Account Update Error...\n');

  // Step 1: Check authentication
  console.log('Step 1: Checking authentication...');
  const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token');
  if (!token) {
    console.error('❌ No authentication token found.');
    console.log('💡 Solution: Please log in first');
    return;
  }
  console.log('✅ Authentication token found');

  // Step 2: Check user data
  console.log('\nStep 2: Checking stored user data...');
  const userData = localStorage.getItem('superadmin_data') || sessionStorage.getItem('superadmin_data');
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    console.log('✅ User data found:', parsedUserData);
    console.log('👤 User ID:', parsedUserData._id);
    console.log('👤 User role:', parsedUserData.role);
  } else {
    console.log('⚠️ No user data found in storage');
  }

  // Step 3: Test API endpoints
  console.log('\nStep 3: Testing API endpoints...');
  
  // Test superadmin API
  try {
    console.log('🧪 Testing Superadmin API...');
    const superadminResponse = await fetch('/api/superadmin/superadmins', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Superadmin API Status:', superadminResponse.status);
    console.log('Superadmin API OK:', superadminResponse.ok);
    
    if (!superadminResponse.ok) {
      const errorText = await superadminResponse.text();
      console.log('Superadmin API Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Superadmin API Error:', error);
  }

  // Test member API
  try {
    console.log('🧪 Testing Member API...');
    const memberResponse = await fetch('/api/superadmin/members', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Member API Status:', memberResponse.status);
    console.log('Member API OK:', memberResponse.ok);
    
    if (!memberResponse.ok) {
      const errorText = await memberResponse.text();
      console.log('Member API Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Member API Error:', error);
  }

  // Step 4: Test specific user update
  console.log('\nStep 4: Testing specific user update...');
  if (userData) {
    const parsedUserData = JSON.parse(userData);
    const userId = parsedUserData._id;
    const userRole = parsedUserData.role;
    
    console.log('Testing update for user:', userId, 'with role:', userRole);
    
    try {
      let apiEndpoint = '';
      let testData = {};
      
      if (userRole === 'superadmin') {
        apiEndpoint = `/api/superadmin/superadmins/${userId}`;
        testData = {
          fullName: parsedUserData.fullName,
          email: parsedUserData.email,
          phoneNumber: parsedUserData.phoneNumber
        };
      } else {
        apiEndpoint = `/api/superadmin/members/${userId}`;
        testData = {
          name: parsedUserData.name || parsedUserData.fullName,
          email: parsedUserData.email,
          phone: parsedUserData.phone || parsedUserData.phoneNumber,
          username: parsedUserData.username || 'testuser'
        };
      }
      
      console.log('API Endpoint:', apiEndpoint);
      console.log('Test Data:', testData);
      
      const updateResponse = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      console.log('Update Response Status:', updateResponse.status);
      console.log('Update Response OK:', updateResponse.ok);
      
      const responseText = await updateResponse.text();
      console.log('Update Response Text:', responseText);
      
      if (updateResponse.ok) {
        console.log('✅ Update test successful');
      } else {
        console.log('❌ Update test failed');
        try {
          const errorData = JSON.parse(responseText);
          console.log('Error Details:', errorData);
        } catch (e) {
          console.log('Raw Error Response:', responseText);
        }
      }
    } catch (error) {
      console.log('❌ Update test error:', error);
    }
  }

  // Step 5: Common Issues and Solutions
  console.log('\nStep 5: Common Issues and Solutions:');
  console.log('🔍 Check browser console for detailed error messages');
  console.log('🔍 Check Network tab in DevTools for API request details');
  console.log('🔍 Verify the API endpoint is correct');
  console.log('🔍 Check if the user ID exists in the database');
  console.log('🔍 Verify authentication token is valid');
  console.log('🔍 Check if the request body format is correct');

  // Step 6: Manual Debug Steps
  console.log('\nStep 6: Manual Debug Steps:');
  console.log('1. Open browser DevTools (F12)');
  console.log('2. Go to Network tab');
  console.log('3. Try to update account in settings');
  console.log('4. Look for the PUT request to /api/superadmin/superadmins/[id] or /api/superadmin/members/[id]');
  console.log('5. Check the request status (should be 200 for success)');
  console.log('6. Check the response body for error details');
  console.log('7. Check the request headers for Authorization token');

  console.log('\n🎯 Debug Complete! Check the results above for the specific issue.');
};

// Instructions for running the debug
console.log(`
🐛 Account Update Error Debug

This script helps identify why the "Failed to update account" error occurs.

To run the debug:
1. Open browser console (F12)
2. Run: debugAccountUpdateError()

The debug will check:
🔧 Authentication status
🔧 User data availability
🔧 API endpoint accessibility
🔧 Specific user update test
🔧 Common issues and solutions

Ready to debug? Run: debugAccountUpdateError()
`);

// Uncomment the line below to run the debug automatically
// debugAccountUpdateError();














