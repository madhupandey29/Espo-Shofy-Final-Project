/**
 * Test script for Product API
 * This script tests the product API endpoint to verify suitability data is returned
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

async function testProductAPI() {
  console.log('🧪 Testing Product API for suitability data...\n');

  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    // Test the specific product slug from your example
    const productSlug = 'nokia-602-product-slug';
    const response = await fetch(`${API_BASE_URL}/product/fieldname/productslug/${productSlug}`, {
      method: 'GET',
      headers,
    });

    console.log(`📡 API Response Status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Response received successfully\n');

    // Check data structure
    console.log('📋 Data Structure Analysis:');
    console.log('- Response has data property:', !!data.data);
    console.log('- Data is array:', Array.isArray(data.data));
    
    if (data.data && data.data[0]) {
      const productData = data.data[0];
      console.log('- Product Name:', productData.name || 'Not provided');
      console.log('- Product ID:', productData.id || 'Not provided');
      console.log('- Suitability field:', Array.isArray(productData.suitability) ? `Array with ${productData.suitability.length} items` : typeof productData.suitability);
      console.log('- aiTempOutput field:', productData.aiTempOutput ? `Present (${productData.aiTempOutput.length} chars)` : 'Missing');
      
      if (productData.aiTempOutput) {
        console.log('\n📄 aiTempOutput sample (first 200 chars):');
        console.log(productData.aiTempOutput.substring(0, 200) + '...');
      }
      
      if (Array.isArray(productData.suitability) && productData.suitability.length > 0) {
        console.log('\n📋 Suitability array contents:');
        productData.suitability.forEach((item, index) => {
          console.log(`${index + 1}. ${JSON.stringify(item)}`);
        });
      }
    }

    console.log('\n✅ Product API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Product API test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure your API server is running');
      console.log('2. Check if the API_BASE_URL is correct');
      console.log('3. Verify the product slug exists');
    }
  }
}

// Run the test
testProductAPI();