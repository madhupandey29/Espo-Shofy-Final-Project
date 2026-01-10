const API_BASE_URL = 'https://espobackend.vercel.app/api';

async function testNokiaCollectionIssue() {
  console.log('🔍 Testing Nokia Collection Issue...\n');

  try {
    // Test Nokia collection with different pagination
    const nokiaCollectionId = '690a0e676132664ee';
    
    console.log('📋 Step 1: Testing Nokia collection pagination...');
    
    // Test different page sizes
    const testCases = [
      { page: 1, limit: 20 },
      { page: 1, limit: 50 },
      { page: 1, limit: 100 },
      { page: 2, limit: 20 },
      { page: 3, limit: 20 },
    ];
    
    for (const testCase of testCases) {
      const url = `${API_BASE_URL}/product/fieldname/collectionId/${nokiaCollectionId}?page=${testCase.page}&limit=${testCase.limit}`;
      console.log(`\n📡 Testing: Page ${testCase.page}, Limit ${testCase.limit}`);
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ Success: ${data.data.length} products returned`);
        console.log(`  📊 Total: ${data.total} products`);
        console.log(`  📄 Pagination: ${JSON.stringify(data.pagination)}`);
        
        if (testCase.page === 1 && testCase.limit === 20 && data.data.length === 33) {
          console.log('  🎯 FOUND: This might be the issue - getting all products in first page');
        }
      } else {
        console.log(`  ❌ Failed: ${response.status}`);
      }
    }
    
    // Test without pagination parameters
    console.log('\n📋 Step 2: Testing Nokia collection without pagination...');
    const noPaginationUrl = `${API_BASE_URL}/product/fieldname/collectionId/${nokiaCollectionId}`;
    const noPaginationResponse = await fetch(noPaginationUrl);
    
    if (noPaginationResponse.ok) {
      const noPaginationData = await noPaginationResponse.json();
      console.log(`✅ No pagination: ${noPaginationData.data.length} products returned`);
      console.log(`📊 Total: ${noPaginationData.total} products`);
    }
    
    // Test the general product endpoint to see total
    console.log('\n📋 Step 3: Testing general product endpoint...');
    const generalUrl = `${API_BASE_URL}/product`;
    const generalResponse = await fetch(generalUrl);
    
    if (generalResponse.ok) {
      const generalData = await generalResponse.json();
      console.log(`✅ General endpoint: ${generalData.data?.length || 0} products returned`);
      console.log(`📊 Total: ${generalData.total || 0} products`);
      
      // Check Nokia products in general endpoint
      const nokiaProducts = generalData.data?.filter(p => 
        p.collectionName === 'Nokia - 100% Cotton Brushed Super Soft Poplin'
      ) || [];
      console.log(`📦 Nokia products in general endpoint: ${nokiaProducts.length}`);
      
      // Check Majestica products in general endpoint
      const majesticaProducts = generalData.data?.filter(p => 
        p.collectionName === 'Majestica - 100% Cotton Bio Finish Twill'
      ) || [];
      console.log(`📦 Majestica products in general endpoint: ${majesticaProducts.length}`);
      
      // Check products without collection
      const noCollectionProducts = generalData.data?.filter(p => 
        !p.collectionName || p.collectionName === ''
      ) || [];
      console.log(`📦 Products without collection: ${noCollectionProducts.length}`);
      
      if (noCollectionProducts.length > 0) {
        console.log('📋 Sample products without collection:');
        noCollectionProducts.slice(0, 3).forEach((product, i) => {
          console.log(`  ${i + 1}. ${product.name} (ID: ${product.id})`);
        });
      }
    } else {
      console.log(`❌ General endpoint failed: ${generalResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNokiaCollectionIssue();