// Debug script to test the eCatalogue SEO API
const API_BASE = 'https://espobackend.vercel.app/api';

async function testSeoApi() {
  try {
    console.log('🔍 Testing eCatalogue SEO API...');
    
    const response = await fetch(`${API_BASE}/sitesettings/fieldname/name/eCatalogue`);
    
    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data && data.data.length > 0) {
      const seoSettings = data.data[0];
      console.log('\n📋 SEO Settings:');
      console.log('- GA ID:', seoSettings.gaMeasurementId);
      console.log('- GTM ID:', seoSettings.gtmId);
      console.log('- Clarity ID:', seoSettings.clarityId);
      console.log('- Google Verification:', seoSettings.googleVerification);
      console.log('- Bing Verification:', seoSettings.bingVerification);
      console.log('- Twitter Handle:', seoSettings.twitterHandle);
      console.log('- Robots Policy:', seoSettings.robotsPolicy);
      console.log('- Site Status:', seoSettings.siteStatus);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSeoApi();