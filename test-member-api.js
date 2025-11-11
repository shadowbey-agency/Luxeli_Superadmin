// Test script for Member API
// You can run this in your browser console or use it as a reference

const testMemberAPI = async () => {
  const baseURL = 'http://localhost:3000/api/test/member';
  
  // Test data
  const testMember = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    username: "johndoe",
    password: "password123",
    permissions: ["dashboard", "support"]
  };

  try {
    // Test POST - Create member
    console.log('Testing POST - Create member...');
    const createResponse = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMember)
    });
    
    const createResult = await createResponse.json();
    console.log('Create result:', createResult);
    
    if (createResult.success) {
      const memberId = createResult.data.id;
      
      // Test GET - Get all members
      console.log('Testing GET - Get all members...');
      const getResponse = await fetch(baseURL);
      const getResult = await getResponse.json();
      console.log('Get all result:', getResult);
      
      // Test GET with ID - Get specific member
      console.log('Testing GET with ID - Get specific member...');
      const getByIdResponse = await fetch(`http://localhost:3000/api/superadmin/members/${memberId}`);
      const getByIdResult = await getByIdResponse.json();
      console.log('Get by ID result:', getByIdResult);
      
      // Test PUT - Update member
      console.log('Testing PUT - Update member...');
      const updateResponse = await fetch(`http://localhost:3000/api/superadmin/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "John Updated",
          permissions: ["dashboard", "support", "services"]
        })
      });
      const updateResult = await updateResponse.json();
      console.log('Update result:', updateResult);
      
      // Test DELETE - Delete member
      console.log('Testing DELETE - Delete member...');
      const deleteResponse = await fetch(`http://localhost:3000/api/superadmin/members/${memberId}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteResponse.json();
      console.log('Delete result:', deleteResult);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Uncomment the line below to run the test
// testMemberAPI();














