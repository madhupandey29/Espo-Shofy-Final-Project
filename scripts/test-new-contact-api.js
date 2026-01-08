// Test the new contact API endpoint
async function testContactAPI() {
  const apiUrl = 'https://espo.egport.com/api/v1/LeadCapture/a4624c9bb58b8b755e3d94f1a25fc9be';
  
  const testPayload = {
    salutationName: "Mr.",
    firstName: "John",
    lastName: "Doe",
    middleName: "William",
    emailAddress: "john.doe@example.com",
    phoneNumber: "+1-555-123-4567",
    accountName: "Test Company Inc.",
    addressStreet: "123 Main Street",
    addressCity: "New York",
    addressState: "NY",
    addressCountry: "USA",
    addressPostalCode: "10001",
    opportunityAmountCurrency: "USD",
    opportunityAmount: 50000,
    cBusinessType: ["garment-manufacturer"],
    cFabricCategory: ["cotton"],
    description: "We are interested in high-quality cotton fabrics for our upcoming collection. Looking for sustainable options with good durability."
  };

  console.log('Testing Contact API...');
  console.log('URL:', apiUrl);
  console.log('Payload:', JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log('\nResponse Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.ok) {
      console.log('\n✅ API test successful!');
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed Response:', JSON.stringify(jsonResponse, null, 2));
      } catch (e) {
        console.log('Response is not JSON format');
      }
    } else {
      console.log('\n❌ API test failed!');
    }

  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
  }
}

testContactAPI();