// Test script for SuperAdmin Header Integration
// You can run this in your browser console or use it as a reference

const testSuperAdminIntegration = async () => {
  const baseURL = 'http://localhost:3000/api/test/superadmin';
  
  // Test data for creating a superadmin
  const testSuperAdmin = {
    fullName: "John Admin",
    email: "john.admin@example.com",
    phoneNumber: "+1234567890",
    password: "password123",
    profileImage: null
  };

  try {
    // Test POST - Create superadmin
    console.log('Testing POST - Create superadmin...');
    const createResponse = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSuperAdmin)
    });
    
    const createResult = await createResponse.json();
    console.log('Create result:', createResult);
    
    if (createResult.success) {
      // Test login with the created superadmin
      console.log('Testing login...');
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testSuperAdmin.email,
          password: testSuperAdmin.password,
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login result:', loginResult);
      
      if (loginResult.success) {
        // Store the auth data
        localStorage.setItem('superadmin_token', loginResult.token);
        localStorage.setItem('superadmin_data', JSON.stringify(loginResult.superAdmin));
        
        console.log('✅ SuperAdmin created and logged in successfully!');
        console.log('✅ Header should now display:', {
          name: loginResult.superAdmin.fullName,
          role: loginResult.superAdmin.role,
          initials: loginResult.superAdmin.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        });
        
        // Redirect to superadmin dashboard to see the header
        window.location.href = '/superadmin/pages/dashboard';
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Instructions for testing:
console.log(`
🧪 SuperAdmin Header Integration Test

To test the integration:

1. Run this script in your browser console
2. Or manually create a superadmin:
   - POST to /api/test/superadmin with the test data
   - Login with the created credentials
   - Navigate to /superadmin/pages/dashboard

Expected result:
- Header should show the superadmin's full name
- Role should display as "Superadmin" 
- Initials should be generated from the full name
- Logout button should work properly

Test data:
- Name: "John Admin"
- Email: "john.admin@example.com"
- Password: "password123"
- Expected initials: "JA"
`);

// Uncomment the line below to run the test
// testSuperAdminIntegration();



