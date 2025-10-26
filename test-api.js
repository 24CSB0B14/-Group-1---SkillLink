// Test API connection
async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test direct fetch
    const response = await fetch('http://localhost:3000/api/v1/healthCheck');
    const data = await response.json();
    console.log('Direct fetch result:', data);
    
    // Test axios (if available)
    if (typeof axios !== 'undefined') {
      const axiosResponse = await axios.get('http://localhost:3000/api/v1/healthCheck');
      console.log('Axios result:', axiosResponse.data);
    }
    
    console.log('API connection test completed successfully');
  } catch (error) {
    console.error('API connection test failed:', error);
  }
}

// Run the test
testAPI();