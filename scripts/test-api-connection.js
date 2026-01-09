#!/usr/bin/env node

// Simple script to test API connectivity
const https = require('https');

const API_BASE_URL = 'https://espobackend.vercel.app/api';
const API_KEY = 'rajeshsir';
const ADMIN_EMAIL = 'vivekkalal4690@gmail.com';

function testApiEndpoint(endpoint, description) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`\n🔍 Testing ${description}:`);
    console.log(`   URL: ${url}`);
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-admin-email': ADMIN_EMAIL,
        'User-Agent': 'Node.js Test Script'
      },
      timeout: 10000
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Headers:`, res.headers);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`   Response: ${JSON.stringify(jsonData, null, 2).substring(0, 500)}...`);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          console.log(`   Raw Response: ${data.substring(0, 500)}...`);
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      reject(error);
    });

    req.on('timeout', () => {
      console.log(`   ⏰ Request timed out`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(10000);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing API Connectivity...');
  console.log(`📍 Base URL: ${API_BASE_URL}`);
  
  const tests = [
    { endpoint: '/product/?limit=5', description: 'Basic Product Endpoint' },
    { endpoint: '/product/?limit=200', description: 'Large Product Fetch (Popular/TopRated)' },
    { endpoint: '/product/fieldname/merchTags/PopularFabrics', description: 'Popular Products Endpoint' },
    { endpoint: '/product/fieldname/merchTags/TopRatedFabrics', description: 'Top Rated Products Endpoint' }
  ];

  for (const test of tests) {
    try {
      await testApiEndpoint(test.endpoint, test.description);
      console.log(`   ✅ Success`);
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🏁 API connectivity test completed.');
}

runTests().catch(console.error);