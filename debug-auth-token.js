// Debug script for authentication token issue
// Run this in browser console to check token storage

const debugAuthToken = () => {
  console.log('🔍 Debugging Authentication Token Storage...\n');
  
  // Check localStorage
  const localStorageToken = localStorage.getItem('superadmin_token');
  const localStorageData = localStorage.getItem('superadmin_data');
  
  // Check sessionStorage
  const sessionStorageToken = sessionStorage.getItem('superadmin_token');
  const sessionStorageData = sessionStorage.getItem('superadmin_data');
  
  console.log('📦 localStorage:');
  console.log('  Token:', localStorageToken ? 'Found' : 'Not found');
  console.log('  Data:', localStorageData ? 'Found' : 'Not found');
  
  console.log('\n📦 sessionStorage:');
  console.log('  Token:', sessionStorageToken ? 'Found' : 'Not found');
  console.log('  Data:', sessionStorageData ? 'Found' : 'Not found');
  
  // Check which one has the token
  if (localStorageToken) {
    console.log('\n✅ Token found in localStorage');
    console.log('Token value:', localStorageToken.substring(0, 20) + '...');
  } else if (sessionStorageToken) {
    console.log('\n✅ Token found in sessionStorage');
    console.log('Token value:', sessionStorageToken.substring(0, 20) + '...');
  } else {
    console.log('\n❌ No token found in either storage');
  }
  
  // Test the getAuthToken function
  console.log('\n🧪 Testing getAuthToken() function:');
  try {
    // Import the function (this might not work in console, but let's try)
    const token = getAuthToken();
    console.log('getAuthToken() result:', token ? 'Found' : 'Not found');
  } catch (error) {
    console.log('getAuthToken() not available in console');
  }
  
  console.log('\n💡 Solutions:');
  if (!localStorageToken && !sessionStorageToken) {
    console.log('1. Please log in again at /login');
    console.log('2. Make sure to check "Remember me" if you want token in localStorage');
    console.log('3. Check if login was successful');
  } else {
    console.log('1. Token is stored correctly');
    console.log('2. The issue might be in the partner form code');
    console.log('3. Check browser console for more details when saving partner');
  }
};

// Instructions
console.log(`
🔧 Authentication Token Debug Tool

This script will help debug why the partner form shows "Please log in to create a partner" 
even when you're logged in.

To run the debug:
1. Open browser console (F12)
2. Run: debugAuthToken()

The script will check:
✅ localStorage for superadmin_token
✅ sessionStorage for superadmin_token  
✅ localStorage for superadmin_data
✅ sessionStorage for superadmin_data

Common issues:
❌ Token stored in sessionStorage but form checks localStorage only
❌ Token expired or invalid
❌ Login didn't complete successfully
❌ Browser cleared storage

Ready to debug? Run: debugAuthToken()
`);

// Uncomment to run automatically
// debugAuthToken();


